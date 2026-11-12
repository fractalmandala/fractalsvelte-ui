// doc.ts is evaluated statically: the object literal passed to defineDoc() must
// be plain data (strings, template literals without substitutions, numbers,
// booleans, arrays, nested objects). Anything else is a gate error.

import ts from 'typescript';
import { parseTs } from './api.ts';

export type Static = string | number | boolean | null | Static[] | { [key: string]: Static };

export interface DocEval {
	value: { [key: string]: Static } | null;
	error: string | null;
	line: number | null;
}

class NotStatic extends Error {
	node: ts.Node;
	constructor(node: ts.Node, message: string) {
		super(message);
		this.node = node;
	}
}

function evalNode(n: ts.Expression, sf: ts.SourceFile): Static {
	if (ts.isParenthesizedExpression(n)) return evalNode(n.expression, sf);
	if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
	if (ts.isNumericLiteral(n)) return Number(n.text);
	if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
	if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
	if (n.kind === ts.SyntaxKind.NullKeyword) return null;
	if (ts.isArrayLiteralExpression(n)) {
		return n.elements.map((e) => {
			if (ts.isSpreadElement(e)) throw new NotStatic(e, 'spread elements are not static');
			return evalNode(e, sf);
		});
	}
	if (ts.isObjectLiteralExpression(n)) {
		const obj: { [key: string]: Static } = {};
		for (const p of n.properties) {
			if (!ts.isPropertyAssignment(p)) throw new NotStatic(p, `\`${p.getText(sf).slice(0, 40)}\` is not a plain property`);
			let key: string;
			if (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name)) key = p.name.text;
			else throw new NotStatic(p.name, 'computed keys are not static');
			obj[key] = evalNode(p.initializer, sf);
		}
		return obj;
	}
	throw new NotStatic(n, `\`${n.getText(sf).slice(0, 40)}\` is not a literal`);
}

export function evalDoc(source: string): DocEval {
	const sf = parseTs(source, 'doc.ts');
	const line = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
	for (const st of sf.statements) {
		if (!ts.isExportAssignment(st) || st.isExportEquals) continue;
		const call = st.expression;
		if (!ts.isCallExpression(call) || call.expression.getText(sf) !== 'defineDoc' || call.arguments.length !== 1) {
			return { value: null, error: 'the default export must be `defineDoc({ … })`', line: line(st) };
		}
		const arg = call.arguments[0];
		if (!ts.isObjectLiteralExpression(arg)) {
			return { value: null, error: 'doc.ts must be a static literal: defineDoc() takes an object literal', line: line(arg) };
		}
		try {
			const value = evalNode(arg, sf);
			return { value: value as { [key: string]: Static }, error: null, line: line(arg) };
		} catch (err) {
			if (err instanceof NotStatic) {
				return { value: null, error: `doc.ts must be a static literal — ${err.message}`, line: line(err.node) };
			}
			throw err;
		}
	}
	return { value: null, error: 'doc.ts has no `export default defineDoc({ … })`', line: 1 };
}
