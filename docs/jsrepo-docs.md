# Introduction (/docs)

[shadcn/ui](https://ui.shadcn.com) proved that distributing code in a way that allows consumers to own the source is an extremely powerful pattern. Since then registries have become a common way to distribute reusable components.

As more and more registries start to emerge it became clear that there was a need for a more powerful toolchain to help manage and distribute these registries. That's where **jsrepo** comes in...

**jsrepo** is a toolchain for distributing your code. It gives powerful tools to both registry owners and consumers. 

**Registry owners...**
- Don't want to have to write their own CLI and build system to distribute their code
- Want to be able to test and verify that their registry will work for their users before they publish it
- Want to be able to host their registries privately without having to write their own hosting solution

**Registry consumers...**
- Want to quickly add items from a registry to their project and start using them without having to even look at the code
- Want to be able to easily update their items with visibility to what as changed
- Want to be able to install and manage code from multiple registries in a single project
- Want an easy way to authenticate to private registries

**jsrepo...**
- Provides a powerful CLI for building and distributing your registry
- Prevents you from publishing broken or unusable registries
- Provides provider adapters to allow you to host your registry publicly or privately anywhere you want
- Automatically resolves dependencies to other items so your items always come ready to use
- Provides an interactive update command to easily update your items with visibility to what as changed
- Allows you to authenticate to private registries with `jsrepo auth`

<Accordion type="single" collapsible>
	<AccordionItem value="q-1">
		<AccordionTrigger>Is this trying to replace npm?</AccordionTrigger>
		<AccordionContent className="flex flex-col gap-4 text-balance">
			No, **jsrepo** won't replace npm, but it's perfect for distributing code like leftPad that probably shouldn't
			be a package but also shouldn't have to be rewritten every time.
		</AccordionContent>
	</AccordionItem>
	<AccordionItem value="q-2">
		<AccordionTrigger>Is this shadcn compatible?</AccordionTrigger>
		<AccordionContent className="flex flex-col gap-4 text-balance">
			Yes **jsrepo** is fully shadcn compatible. You can add and update items from **shadcn** with zero configuration needed.
		</AccordionContent>
	</AccordionItem>
</Accordion>


# Create a registry (/docs/create-a-registry)

In this guide we will show you how to setup a registry with **jsrepo**.

## Creating a registry [#creating-a-registry]

To create a registry start by running:

```npm
npx jsrepo init
```

This will initialize a blank config in your project and install **jsrepo** as a dev dependency.

Before we continue let's create some items for our registry.

```ts tab="src/stdout.ts"
export function print(msg: string) {
    console.log(msg);
}
```

```ts tab="src/logger.ts"
import { print } from './stdout';
export function createLogger() {
    return {
        log: print,
    }
}
```

Next we can configure the registry with the `registry` key.

Let's start by giving the registry a name:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		name: 'my-first-registry', // [!code ++]
	},
});
```

Next let's add the items we just created to the registry:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
        // ...
        items: [ // [!code ++]
            { // [!code ++]
                name: 'logger', // [!code ++]
                type: 'utils', // [!code ++]
                files: [ // [!code ++]
                    { // [!code ++]
                        path: 'src/logger.ts', // [!code ++]
                    }, // [!code ++]
                ] // [!code ++]
            }, // [!code ++]
            { // [!code ++]
                name: 'stdout', // [!code ++]
                type: 'utils', // [!code ++]
                add: 'when-needed', // [!code ++] this will prevent the item from being listed by the `add` command
                files: [ // [!code ++]
                    { // [!code ++]
                        path: 'src/stdout.ts', // [!code ++]
                    }, // [!code ++]
                ] // [!code ++]
            } // [!code ++]
        ], // [!code ++]
    }
});
```

For now we will use the `repository` output for our registry so let's add it to our config:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs"; // [!code ++]

export default defineConfig({
	registry: {
        // ...
		outputs: [repository()], // [!code ++]
	},
});
```

Now we can build our registry with the `jsrepo build` command:

```sh
jsrepo build
```

This will create a `registry.json` file at the root of our project that contains everything we need to start adding items from our registry to other projects.

### Testing the registry [#testing-the-registry]

To test our registry locally we can use the `fs` provider. Let's add it to our config:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs";
import { fs } from "jsrepo/providers"; // [!code ++]

export default defineConfig({
    // ...
	providers: [fs()], // [!code ++]
});
```

Now let's initialize our registry with the `jsrepo init` command:   

```sh
jsrepo init fs://./
```

This will add the registry to the `registries` key in our config file:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs";
import { fs } from "jsrepo/providers";

export default defineConfig({
	// ...
	registries: ["fs://./"], // [!code ++]
});
```

Now we can run `jsrepo add` to add an item to our project:

```sh
jsrepo add logger
```

## Deploying your registry [#deploying-your-registry]

This is the end of the basic guide.

Now that you have a working registry you can deploy it wherever you want! Take a look at the [providers](/docs/providers) docs for the full list of hosting options. 

For more advanced usage you can continue reading below...

## Advanced Usage [#advanced-usage]

Now that we have covered the basics of creating a registry we can start to explore some of the features that make **jsrepo** so powerful.

### Resolving Dependencies [#resolving-dependencies]

**jsrepo** automatically resolves dependencies both to other items in the registry and to remote packages. This ensures that when building your registry it will work out of the box for end users.

#### Excluding dependencies [#excluding-dependencies]

Many times you may not want certain dependencies to be installed with your registry items. For instance if you import `useState` from `react` you probably don't want to force users to install `react` with your registry.

For this you can use the `excludeDeps` key of your registry config.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
        // ...
		excludeDeps: ["react"], // [!code ++]
	},
});
```

<Callout type="info">
    It's good practice to put your framework in the `excludeDeps` list whether that be `react`, `vue`, `svelte` etc.
</Callout>

#### Opting out of automatic dependency resolution [#opting-out-of-automatic-dependency-resolution]

Occasionally you may want to opt out of automatic dependency resolution for a particular item or file.

To do this you can set the `dependencyResolution` key to `manual` on the item or on specific files within the item:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				// ...
				dependencyResolution: "manual", // [!code ++]
			}
		]
	},
});
```

#### Resolving `workspace:` and `catalog:` dependencies [#resolving-workspace-and-catalog-dependencies]

By default `workspace:` and `catalog:` dependencies won't be handled by **jsrepo**, however if you are using `pnpm` or `bun` you can use the `@jsrepo/pnpm` or `@jsrepo/bun` packages to automatically resolve these dependencies.

pnpm:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { pnpm } from "@jsrepo/pnpm"; // [!code ++]

export default defineConfig({
    // ...
	build: {
		remoteDependencyResolver: pnpm(), // [!code ++]
	},
});
```

bun:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { bun } from "@jsrepo/bun"; // [!code ++]

export default defineConfig({
    // ...
	build: {
		remoteDependencyResolver: bun(), // [!code ++]
	},
});
```

Now when you build your registry the `workspace:` and `catalog:` dependencies will be resolved to concrete versions.

### Files [#files]

We showed you how to include files in the registry earlier by referencing them by their path but there's much more to know!

#### File types [#file-types]

Files can have any type that an item can. If you don't provide a type the file will simply inherit the type from the parent item.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				// ...
                files: [
                    {
                        path: "src/example.ts",
                        type: "utils", // [!code ++]
                    }
                ]
			}
		]
	}
});
```

#### File dependencies [#file-dependencies]

Just like items you can set the `dependencyResolution` to `manual` and manually specify the dependencies of a file.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				// ...
                files: [
                    {
                        path: "src/example.ts",
                        dependencyResolution: "manual", // [!code ++]
                        dependencies: ["chalk"], // [!code ++]
                    }
                ]
			}
		]
	}
});
```

#### File roles [#file-roles]

File roles classify files into different categories that can be optionally installed by the user. The built-in roles are:

- `file` - The default (always installed)
- `example` - An example file
- `doc` - A documentation file
- `test` - A test file
- Custom roles - Any other role you want to give files in your registry

By default only files with the `file` role are included.

Users can include files with specific roles using the `--with <role>` flag:

```sh
jsrepo add --with story doc
```

<Callout type="info">
    These files are also made available to LLMs when using the `@jsrepo/mcp` server.
</Callout>

You can specify the role of a file when you define it on an item:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
        // ...
		items: [
			{
				// ...
				files: [
					{
						path: "src/example.ts",
						role: "example", // [!code ++]
					},
				],
			}
		]
	},
});
```

Files with any non-`file` role will only install their dependencies when the file is included.

For example if you have a file with `role: "test"` that depends on `vitest`. `vitest` will only be installed to the user's project when the user provides `--with test`.

Similarly if that same file was to depend on another item in the registry. Then that item will only be installed to the user's project when the test file is added.

This allows you to add **documentation**, **examples**, **tests**, or any other optional role to your registry without forcing the user to install them.

#### Folders [#folders]

When using frameworks like **Svelte** you are forced to define *one component per file* which will require you to bundle all your files into a folder. In cases like this you need to be able to include folders in your registry.

Doing this is intuitive in **jsrepo**.

Let's take for example, this **Empty** component:



<Files>
	<Folder name="src" defaultOpen>
		<Folder name="components" defaultOpen>
			<Folder name="ui" defaultOpen>
				<Folder name="empty" defaultOpen>
					<File name="empty-content.svelte" />
					<File name="empty-description.svelte" />
					<File name="empty-header.svelte" />
					<File name="empty-media.svelte" />
					<File name="empty-title.svelte" />
                    <File name="empty.svelte" />
					<File name="index.ts" />
				</Folder>
			</Folder>
		</Folder>
	</Folder>
</Files>

We can simply reference the folder path and **jsrepo** will automatically include all the files in the folder:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				name: 'empty',
				type: 'ui',
				files: [
					{
						path: 'src/components/ui/empty', // [!code ++]
					},
				],
			},
		],
	},
});
```

All the files in the folder will be included in the registry automatically and when users add them they will be added together under the `empty` folder.

If you need to configure the files that are included in a folder you can use the `files` key on folder. This is also useful if you need to change properties like the `role` or `dependencyResolution` of a particular file.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				// ...
				files: [
					{
						path: 'src/components/ui/empty', // [!code ++]
                        files: [ // [!code ++]
                            { // [!code ++]
                                // file paths are relative to the parent folder path so this turns into `src/components/ui/empty/empty-content.svelte` // [!code ++]
                                path: 'empty-content.svelte', // [!code ++]
                                // you can also configure other properties like the `role` or `dependencyResolution` of a particular file. // [!code ++]
                                dependencyResolution: 'manual', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'empty-description.svelte', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'empty-header.svelte', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'empty-media.svelte', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'empty-title.svelte', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'empty.svelte', // [!code ++]
                            }, // [!code ++]
                            { // [!code ++]
                                path: 'index.ts', // [!code ++]
                            }, // [!code ++]
                        ], // [!code ++]
					},
				],
			},
		],
	});
});
```

#### Glob patterns in file paths [#glob-patterns-in-file-paths]

You can also use glob patterns in file paths to include all files that match the pattern.

For example lets say I want to include all my demos for the button component as examples:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
                name: 'button',
                type: 'ui',
				files: [
                    {
                        path: 'src/lib/components/button',
                    },
					{
						path: "src/lib/demos/button-*.svelte", // [!code ++]
                        role: 'example',
                        dependencyResolution: 'manual',
					},
				],
			},
		],
	});
});
```

This will match all files that match the pattern `button-*.svelte` in the `src/lib/demos` directory.

**Recursive glob patterns:**

Match files in subdirectories while preserving the directory structure:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
                name: 'button',
                type: 'ui',
				files: [
                    {
                        path: 'src/lib/components/button',
                    },
					{
						path: "src/lib/demos/**/button-*.svelte", // [!code ++]
                        role: 'example',
                    },
				],
			},
		],
	});
});
```

This will match all files (including those in subdirectories) that match the pattern `button-*.svelte` while maintaining the directory structure.

For instance:

| Source Path | Path Relative to Item |
|-------------|----------------------|
| `src/lib/demos/button-default.svelte` | `button-default.svelte` |
| `src/lib/demos/variants/button-outlined.svelte` | `variants/button-outlined.svelte` |
| `src/lib/demos/variants/themes/button-dark.svelte` | `variants/themes/button-dark.svelte` |

### Configure when an item is added [#configure-when-an-item-is-added]

We mentioned this briefly above but you can configure when an item is added in the user's project by setting the `add` key an item.

- `"on-init"` - Added on registry init or when it's needed by another item
- `"optionally-on-init"` - Users are prompted to add the item when initializing the registry
- `"when-needed"` - Not listed and only added when another item is added that depends on it
- `"when-added"` - Added when the user selects it to be added

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		items: [
			{
				// ...
				add: "when-added", // [!code ++]
			}
		]
	},
});
```

### Configuring the user's project [#configuring-the-users-project]

There are a few common things you may want to automatically configure in the user's project when they first initialize your registry.

#### Default Paths [#default-paths]

Default paths are just that, the default locations for which items types or specific items should be added to in the user's project.

You can configure the `defaultPaths` key of your registry config to configure the default paths for items or item types to be added to in the user's project.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
        // ...
		defaultPaths: { // [!code ++]
			component: "src/components/ui", // [!code ++]
            // you can of course also configure a specific item by referencing it by `<type>/<name>` // [!code ++]
            "ui/button": "src/components/ui/button", // [!code ++]
		}, // [!code ++]
	},
});
```

#### Plugins [#plugins]

You can configure the `plugins` key to automatically install plugins to the user's project when they initialize your registry.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
		plugins: {
            languages: [{ package: "jsrepo-language-go" }], // [!code ++]
            // by setting the optional key to true the user will be prompted to install the plugin if it is not already installed. // [!code ++]
			transforms: [{ package: "@jsrepo/transform-prettier", optional: true }], // [!code ++]
		},
	},
});
```

### Environment Variables [#environment-variables]

Sometimes your registry items may require environment variables to work.

For this you can define the `envVars` key of that particular item:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: {
        // ...
        items: [
            // ...
            {
                // ...
                name: 'db',
                type: 'lib',
                files: [
                    {
                        path: 'src/db.ts',
                    }
                ],
                envVars: { // [!code ++]
                    DATABASE_URL: "https://example.com/database", // [!code ++]
                    DATABASE_SECRET_TOKEN: "", // [!code ++]
                }, // [!code ++]
            }
        ]
	},
});
```

Environment variables will be added to the users `.env.local` or `.env` file.

If you leave an environment variable blank the user will be prompted to add a value for it.

Values you configure here will ***never*** overwrite existing values in the user's env file.

### Distributing multiple registries [#distributing-multiple-registries]

It's become common to distribute multiple registries to allow users to optionally use different variants of your registry for example JavaScript or TypeScript.

However until now there wasn't an easy way to do this.

**jsrepo** solves this by allowing you to define multiple registries in the same config:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: [
        {
            name: '@my-registry/typescript',
            // ...
        },
        {
            name: '@my-registry/javascript',
            // ...
        }
    ]
});
```

You can then use the `outputs` api to define where each registry should be output to:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { distributed } from "jsrepo/outputs";

export default defineConfig({
	registry: [
        {
            name: '@my-registry/vanilla',
            outputs: [distributed({ dir: "./public/r/v" })], // [!code ++]
            // ...
        },
        {
            name: '@my-registry/tailwind',
            outputs: [distributed({ dir: "./public/r/tw" })], // [!code ++]
            // ...
        }
    ]
});
```

### Dynamically generating registries [#dynamically-generating-registries]

You don't always want to have to manually define your entire registry in your config file.

AI has made this less cumbersome but it's still annoying to have a 1k LOC file just to define your registry.

In **jsrepo v2** we automatically generated your registry based on a bunch of complicated options and this wasn't the best experience.

In **jsrepo v3** we are giving the control back to you allowing you to write your own code to generate your registry.

To do this simply pass a function to the `registry` key that returns a registry config:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
// define your own custom function
import { getItems } from "./getItems";

export default defineConfig({
	registry: ({ cwd }) => {
        return {
            name: 'my-registry',
            items: getItems(cwd)
        }
    }
});
```

Oh and of course you can also pass an array of functions:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
// define your own custom function
import { getItems } from "./getItems";

export default defineConfig({
	registry: [
		({ cwd }) => {
			return {
				name: '@my-registry/typescript',
				items: getItems(path.join(cwd, 'src/registry/ts'))
			}
		},
        ({ cwd }) => {
			return {
				name: '@my-registry/javascript',
				items: getItems(path.join(cwd, 'src/registry/js'))
			}
		}
	]
});
```

<Callout type="info">
    Dynamically generated registries will still work with the `--watch` flag.
</Callout>

### Supporting JavaScript and TypeScript [#supporting-javascript-and-typescript]

Thanks to the **jsrepo** transforms API it's extremely straightforward to allow your users to choose between JavaScript and TypeScript when using your registry.

Users can simply initialize your registry with the `--js` flag to use JavaScript:

```sh
jsrepo init @example/registry --js
# or add the javascript plugin at any time
jsrepo config transform javascript
```

Or add the `@jsrepo/transform-javascript` transform to their config manually:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import javascript from "@jsrepo/transform-javascript"; // [!code ++]

export default defineConfig({
	transforms: [javascript()], // [!code ++]
});
```

This will automatically strip the types from TypeScript files and rename them to JavaScript files. You can see the full documentation for the `@jsrepo/transform-javascript` transform [here](/docs/transforms/javascript).

<Callout type="warning">
    This only works for [erasable syntax](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option) if you are expecting for your users to use TypeScript ensure you are using the `--erasableSyntaxOnly` option when writing your TypeScript code.
</Callout>

### Depending on items from other registries [#depending-on-items-from-other-registries]

Often times you may want to depend on items from other registries. In `shadcn/ui` you would add the registry URL to the item you are dependent on.

**jsrepo** doesn't support this for a few reasons:

1. You may have made changes to the component in your project that are not tracked by the upstream registry. This can break the users code or cause it to function incorrectly.
2. It's possible that the author of the upstream registry may make changes to the component that break your code in users projects.

For this reason **jsrepo** doesn't support depending on items from other registries. The alternative is to simply copy the components from the upstream registry into your own registry and serve them from your own registry.

We recommend when you do this to follow a few best practices:

1. Credit the upstream registry in some way so users know where those items came from.
2. Ensure to set `add: "when-needed"` on items from external registries to prevent them from being listed by the `add` command.

### Modifying items in your registry before build [#modifying-items-in-your-registry-before-build]

Sometimes you may want to modify the content of registry items before they are built to an output.

For example you may want to build multiple different types of your registry for each style you offer.

You can do this with the `build.transforms` option:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	build: {
		transforms: [
			{
				transform: async (content, opts) => {
					return { content: content.replaceAll('{{PROJECT_NAME}}', 'jsrepo') };
				},
			}
		],
	},
});
```

This will run the transform on the content of each file in your registry before it's added to the output. This way you can easily modify the content at build time without needing to write another registry to the filesystem.


# jsrepo.com (/docs/jsrepo-com)

<BadgeGroup>
	<OfficialBadge />
</BadgeGroup>

[jsrepo.com](https://jsrepo.com) is a centralized source registry for registries. Much like npm is for packages, **jsrepo.com** is for registries.

Like npm, you publish your registry to [jsrepo.com](https://jsrepo.com) with the `jsrepo publish` command and then other developers can add your code to their projects with the `jsrepo add` command.

## The benefits of jsrepo.com [#the-benefits-of-jsrepocom]

- Semver support - You can publish multiple versions of the same registry (including pre-release versions) just like you would on npm.
- Easy installation - You can add your registry to your project with the simple `@<scope>/<registry>` syntax.
- Private registries - You can easily publish private registries and share them with your team for free.
- Marketplace - You can monetize your registry by selling it on the marketplace.
- Discoverability - Your registry will be discoverable through the **jsrepo.com** website and the jsrepo mcp server.

## Publishing your registry [#publishing-your-registry]

If you already have a registry that can be built with **jsrepo** then there are only a few steps to publishing it to **jsrepo.com**. If not then checkout the [create a registry](/docs/create-a-registry) guide to get started.

<Steps>

<Step>
    ### Create an account [#create-an-account]
    Go to [jsrepo.com](https://jsrepo.com) and create an account.
</Step>

<Step>
    ### Claim a scope [#claim-a-scope]
    Once you have an account navigate to `/account/scopes/new` to [claim a scope](https://www.jsrepo.com/account/scopes/new). 
    
    Scopes are used to group your registries together and are required to publish your registry.

    When users add your registry the scope will be the first part of the registry name: `@<scope>/<registry>`.
</Step>

<Step>
    ### Authenticate with jsrepo.com [#authenticate-with-jsrepocom]
    Run the following command to authenticate with jsrepo.com:

    ```sh
    jsrepo auth jsrepo
    ```

    You will be prompted to finish the sign in in your browser and then you will be authenticated.
</Step>

<Step>
    ### Prepare your registry [#prepare-your-registry]
    Decide on a name for your registry and add it to your `jsrepo.config.ts` file:

    ```ts title="jsrepo.config.ts"
    import { defineConfig } from "jsrepo";

    export default defineConfig({
        registry: {
            name: "@my-scope/my-registry", // [!code ++]
            // ...
        },
    });
    ```

    Next you need to provide the version or your registry that will be published. If you want **jsrepo** to pull from the version in your `package.json` file just provide `package` as the version:

    ```ts title="jsrepo.config.ts"
    import { defineConfig } from "jsrepo";

    export default defineConfig({
        registry: {
            name: "@my-scope/my-registry",
            version: "1.0.0", // [!code ++]
            // or take the version from the `package.json` file
            version: "package", // [!code ++]
            // ...
        },
    });
    ```

    (Optional) Now is also a good time to add any other metadata you want to your registry:

    ```ts title="jsrepo.config.ts"
    import { defineConfig } from "jsrepo";

    export default defineConfig({
        registry: {
            name: "@my-scope/my-registry",
            description: "My first registry", // [!code ++]
            homepage: "https://my-registry.com", // [!code ++]
            repository: "https://github.com/my-scope/my-registry", // [!code ++]
            bugs: "https://github.com/my-scope/my-registry/issues", // [!code ++]
            authors: ["Aidan Bleser"], // [!code ++]
            tags: ["first-registry"], // [!code ++]
            // ...
        },
    });
    ```

    (Optional) By default your registry will be published as public so anyone can see and use it. You can change the access level to `"private"` or `"marketplace"` by setting the `access` property:

    ```ts title="jsrepo.config.ts"
    import { defineConfig } from "jsrepo";

    export default defineConfig({
        registry: {
            name: "@my-scope/my-registry",
            access: "private", // [!code ++]
        },
    });
    ```
</Step>

<Step>
    ### Publish your registry [#publish-your-registry]
    Run the following command to publish your registry:

    ```sh
    jsrepo publish
    ```
</Step>

<Step>
    ### Start adding items to your project [#start-adding-items-to-your-project]
    Run the following command to add items to your project:

    ```sh
    jsrepo add --registry @my-scope/my-registry
    # or 
    jsrepo init @my-scope/my-registry
    ```
</Step>

</Steps>

## Badges [#badges]

<BadgesTable
	badges={[
		{
			alt: 'jsrepo latest version',
			hrefTemplate: 'https://jsrepo.com/badges/{{registry}}'
		},
		{
			alt: 'jsrepo downloads weekly',
			hrefTemplate: 'https://jsrepo.com/badges/{{registry}}/dm'
		},
		{
			alt: 'jsrepo downloads monthly',
			hrefTemplate: 'https://jsrepo.com/badges/{{registry}}/dw'
		},
		{
			alt: 'jsrepo downloads yearly',
			hrefTemplate: 'https://jsrepo.com/badges/{{registry}}/dy'
		},
		{
			alt: 'jsrepo registry rating',
			hrefTemplate: 'https://jsrepo.com/badges/{{registry}}/rating'
		}
	]}
	defaultRegistry="@ieedan/std"
/>


# jsrepo.config (/docs/jsrepo-config)

The `jsrepo.config.(ts|js|mts|mjs)` file is used to configure **jsrepo** projects and registries.

Having a js based config allows you far more flexibility when configuring your project or registry allowing you to abstract out the reusable parts of your config.

## Creating a config [#creating-a-config]

To create a new config in your project you can run the following command or copy the code below:

```sh
jsrepo init
```

This will initialize a blank config in your project.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	// configure where stuff comes from here
	registries: [],
	// configure where stuff goes here
	paths: {},
});
```

<Callout type="info">
	We default to `.mts` to prevent errors when you don't have `"type": "module"` in your `package.json`. But you can
	rename this to `.ts` if you prefer.
</Callout>

### Create with a registry [#create-with-a-registry]

To create your config with a registry you can run the following command:

```sh
jsrepo init [registry]
```

Let's look at an example...

You might run:

```sh
jsrepo init https://example.com/registry
```

First you will be prompted to install any plugins specified by the registry author:

```plaintext
┌   jsrepo
│
◆  Would you like to add the @jsrepo/transform-prettier transform plugin?
│  ● Yes / ○ No
```

Next you can configure the paths for the items you want to add. (These are the types of the items you can add from the registry)

```plaintext
◆  Which paths would you like to configure?
│  ◻ block (Default: src/components)
│  ◻ component
│  ◻ lib
└
```

Once you have configured the paths any items that were specified by the registry author to add upon initialization will be added to your project. And the resulting config should look like this:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import prettier from "@jsrepo/transform-prettier";

export default defineConfig({
	registries: ["https://example.com/registry"],
	transforms: [prettier()],
	paths: {
		block: "src/components",
		component: "src/components/ui",
		lib: "src/lib",
	},
});
```

## Adding plugins [#adding-plugins]

Plugins are a big part of what makes jsrepo so powerful but having to manually add them to your config kinda sucks. So we've added a way to automatically install and add plugins to your config.

To add a plugin run the following command:

```sh
# add a transform plugin
jsrepo config transform @jsrepo/transform-prettier
# add a provider plugin
jsrepo config provider jsrepo-provider-<provider>
# add a language plugin
jsrepo config language jsrepo-language-<language>
```

This will automatically install the plugin and add it to your config:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import prettier from "@jsrepo/transform-prettier"; // [!code ++]

export default defineConfig({
	registries: ["https://example.com/registry"],
	transforms: [prettier()], // [!code ++]
	paths: {
		block: "src/components",
		component: "src/components/ui",
		lib: "src/lib",
	},
});
```

As your config grows this will continue to work (so long as you don't use some really contrived syntax for your config).

## Options [#options]

### languages [#languages]

Languages are how **jsrepo** knows how to parse and transform code. You can read more about the supported languages [here](/docs/languages).

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { js } from "jsrepo/languages";

export default defineConfig({
	languages: [js()], // [!code highlight]
});
```

### paths [#paths]

Paths are how **jsrepo** knows where to put items in your project. Paths can either reference a type of item or a specific item.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	paths: { // [!code highlight]
		block: "src/components", // [!code highlight]
		// control where a specific item goes by referencing it by `<type>/<name>` // [!code highlight]
		"ui/button": "src/components/ui/button", // [!code highlight]
	}, // [!code highlight]
});
```

### providers [#providers]

Providers are how **jsrepo** knows where to fetch items from. You can read more about providers [here](/docs/providers).

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { fs } from "jsrepo/providers";

export default defineConfig({
	providers: [fs()], // [!code highlight]
});
```

### registries [#registries]

Registries are the default locations that items will be fetched from when you run **jsrepo** commands.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registries: ["https://example.com/registry"], // [!code highlight]
});
```

### registry [#registry]

The `registry` option allows you to define your own registry or registries. You can learn more about creating your own registry [here](/docs/create-a-registry).

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	registry: ..., // [!code highlight]
});
```

### transforms [#transforms]

Transforms allow you to make modifications to code before it is added to your project this is where you might add formatting, and other code modifications. You can read more about transforms [here](/docs/transforms).

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import prettier from "@jsrepo/transform-prettier";

export default defineConfig({
	transforms: [prettier()], // [!code highlight]
});
```

### onwarn [#onwarn]

<Callout type="warning">
**Deprecated:** The top-level `onwarn` option is deprecated. Use [`build.onwarn`](#buildonwarn) instead.
</Callout>

### build.onwarn [#buildonwarn]

The `build.onwarn` option allows you to customize how warnings are handled during the build process. You can suppress specific warnings, transform them, or use the default logging behavior.

The handler receives two arguments:
- `warning`: The warning instance (extends the base `Warning` class)
- `handler`: A function to log the warning using the default format

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { InvalidImportWarning, LanguageNotFoundWarning } from "jsrepo/warnings";

export default defineConfig({
	// ...
	build: {
		onwarn: (warning, handler) => { // [!code highlight]
			// Suppress warnings for SvelteKit internal imports
			if (warning instanceof InvalidImportWarning) { // [!code highlight]
				if (['$app/server', '$app/navigation'].includes(warning.specifier)) { // [!code highlight]
					return; // Don't log this warning // [!code highlight]
				}
			}
			// Suppress language warnings for specific file types
			if (warning instanceof LanguageNotFoundWarning) { // [!code highlight]
				if (warning.path.endsWith('.glb') || warning.path.endsWith('.png')) { // [!code highlight]
					return; // Don't log this warning // [!code highlight]
				}
			}
			// Log all other warnings using the default handler
			handler(warning); // [!code highlight]
		},
	},
});
```

Available warning types:
- `InvalidImportWarning`: Triggered when an import is skipped because it's not a valid package name or path alias
- `LanguageNotFoundWarning`: Triggered when a language cannot be found to resolve dependencies for a file
- `UnresolvableDynamicImportWarning`: Triggered when a dynamic import cannot be resolved due to unresolvable syntax

All warnings extend the base `Warning` class which has a `message` property. Each specific warning type includes additional properties relevant to that warning type.

### build.remoteDependencyResolver [#buildremotedependencyresolver]

The `build.remoteDependencyResolver` option lets you rewrite each detected remote dependency before it is added to the built registry output.

This is useful when your source `package.json` uses version protocols like `workspace:*` or `catalog:` and you want to replace them with concrete versions during build.

For pnpm workspaces (workspace and catalog protocols), use `@jsrepo/pnpm`:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { pnpm } from "@jsrepo/pnpm";

export default defineConfig({
	build: {
		remoteDependencyResolver: pnpm(),
	},
});
```

For bun workspaces, use `@jsrepo/bun`:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { bun } from "@jsrepo/bun";

export default defineConfig({
	build: {
		remoteDependencyResolver: bun(),
	},
});
```

Or implement a custom resolver:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	build: {
		remoteDependencyResolver: async (dep) => {
			if (dep.version === "workspace:*") {
				return { ...dep, version: "1.2.3" };
			}
			if (dep.version === "catalog:") {
				return { ...dep, version: "^4.0.0" };
			}
			return dep;
		},
	},
});
```

### build.transforms [#buildtransforms]

The `build.transforms` option allows you to transform the content of files before they are added to your project.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	build: {
		transforms: [
			{
				transform: async (content, opts) => {
					return { content: content.replaceAll('{{PROJECT_NAME}}', 'jsrepo') };
				},
			}
		],
	},
});
```

### hooks [#hooks]

Hooks allow you to run custom logic before and after CLI commands.

- `before` hooks run before the command executes.
- `after` hooks run after the command completes.

Hooks can be a function, a shell command string, or an array of either.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	hooks: {
		before: ({ command }) => {
			console.log(`Running ${command}...`);
		},
		after: "echo done",
	},
});
```

Function hooks receive typed arguments with a `command` discriminant. Use it to narrow and access command-specific data:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	hooks: {
		after: (args) => {
			if (args.command === "add") {
				console.log(`Added ${args.result.items.length} items`);
			}
		},
	},
});
```

You can also use an array of hooks:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";

export default defineConfig({
	hooks: {
		before: [
			({ command }) => console.log(`Starting ${command}...`),
			"echo 'before hook done'",
		],
	},
});
```


# MCP Server (/docs/mcp)

<BadgeGroup>
	<SourceBadge path="packages/mcp" />
	<OfficialBadge />
    <NpmBadge packageName="@jsrepo/mcp" />
</BadgeGroup>

The **jsrepo** MCP server has been built alongside the **jsrepo** CLI to ensure agents have first class support for interacting with jsrepo registries.

<Callout type="info">
    The **jsrepo** MCP ships separate to the **jsrepo** CLI to reduce the overall size of the CLI and can be found on npm as `@jsrepo/mcp`.
</Callout>

All **jsrepo** registries are supported out of the box by the MCP server, including registries hosted on custom providers (provided the custom provider is present in your `jsrepo.config`).

## Configuration [#configuration]

<UnderlineTabs defaultValue="cursor">
	<UnderlineTabsList>
		<UnderlineTabsTrigger value="cursor"><CursorLogo /> Cursor</UnderlineTabsTrigger>
		<UnderlineTabsTrigger value="claude"><ClaudeLogo /> Claude Code </UnderlineTabsTrigger>
		<UnderlineTabsTrigger value="vs-code"><VSCodeLogo /> VS Code</UnderlineTabsTrigger>
		<UnderlineTabsTrigger value="codex"><OpenAILogo /> Codex</UnderlineTabsTrigger>
		<UnderlineTabsTrigger value="antigravity"><AntigravityLogo /> Antigravity</UnderlineTabsTrigger>
	</UnderlineTabsList>
	<UnderlineTabsContent value="cursor">
        You can quickly configure the MCP server for Cursor by running the following command:

		```sh
        jsrepo config mcp --client cursor
        ```

        This will automatically configure the MCP server for Cursor in the correct file:

        ```json title=".cursor/mcp.json"
        {
            "mcpServers": {
                "jsrepo": {
                    "command": "npx",
                    "args": ["@jsrepo/mcp"]
                }
            }
        }
        ```
	</UnderlineTabsContent>
	<UnderlineTabsContent value="claude">
        You can quickly configure the MCP server for Claude Code by running the following command:

		```sh
        jsrepo config mcp --client claude
        ```

        This will automatically configure the MCP server for Claude Code in the correct file:

        ```json title=".mcp.json"
        {
            "mcpServers": {
                "jsrepo": {
                    "command": "npx",
                    "args": ["@jsrepo/mcp"]
                }
            }
        }
        ```
    </UnderlineTabsContent>
	<UnderlineTabsContent value="vs-code">
        You can quickly configure the MCP server for VSCode by running the following command:

		```sh
        jsrepo config mcp --client vscode
        ```

        This will automatically configure the MCP server for VSCode in the correct file:

        ```json title=".vscode/mcp.json"
        {
            "servers": {
                "jsrepo": {
                    "command": "npx",
                    "args": ["@jsrepo/mcp"]
                }
            }
        }
        ```
    </UnderlineTabsContent>
	<UnderlineTabsContent value="codex">
        You can quickly configure the MCP server for Codex by running the following command:

		```sh
        jsrepo config mcp --client codex
        ```

        This will automatically configure the MCP server for Codex in the correct file:

        ```toml title="~/.codex/config.toml"
        [mcp_servers.jsrepo]
        command = "npx"
        args = ["@jsrepo/mcp"]
        ```
    </UnderlineTabsContent>
    <UnderlineTabsContent value="antigravity">
        You can quickly configure the MCP server for Antigravity by running the following command:

		```sh
        jsrepo config mcp --client antigravity
        ```

        This will automatically configure the MCP server for Antigravity in the correct file:

        ```json title="~/.gemini/antigravity/mcp_config.json"
        {
            "mcpServers": {
                "jsrepo": {
                    "command": "npx",
                    "args": ["@jsrepo/mcp"]
                }
            }
        }
        ```
    </UnderlineTabsContent>
</UnderlineTabs>

## Tools [#tools]

The jsrepo MCP server provides the following tools:

| Tool | Description |
|------|-------------|
| `add_item_to_project` | Add a registry item or items directly to the users project |
| `view_registry_item` | View the code and information about a registry item |
| `list_items_in_registry` | List registry items in one or more registries and optionally fuzzy search |

## Registry Authors [#registry-authors]

Your registry will automatically be compatible with the **jsrepo** MCP server, but here are a few tips to improve the agents usage of your registry:

- include all the registry metadata in your `jsrepo.config` to allow agents to find your registry more easily when searching
- include a `description` with each item in your registry
- include files with `role: "example"` that show how to use each item
- include files with `role: "doc"` that document each item


# add (/docs/cli/add)

```sh
jsrepo add
```

## Usage [#usage]

Add an item from the registries in your `jsrepo.config` file:

```sh
jsrepo add button
```

If the item exists in multiple registries you will be prompted to select which one you want to add:

```
◆  Multiple registries contain button. Please select one:
│  ● button (@ieedan/shadcn-svelte-extras)
│  ○ button (@ai/elements)
└
```

Add an item from a specific registry:

```sh
jsrepo add @ieedan/shadcn-svelte-extras/button
```

Add all items from a specific registry:

```sh
jsrepo add @ieedan/shadcn-svelte-extras --all
```

Add all items from every registry in your `jsrepo.config` file:

```sh
jsrepo add --all
```

## Options [#options]

### `--all` [#--all]

Add all items from every registry:

```sh
jsrepo add --all
```

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo add button --cwd ./my-project
```

### `--expand` [#--expand]

Expands the diff so you see the entire file:

```sh
jsrepo add button --expand
```

### `--max-unchanged` [#--max-unchanged]

Maximum unchanged lines that will show without being collapsed:

```sh
jsrepo add button --max-unchanged 20
```

### `--overwrite` [#--overwrite]

Overwrite files without prompting:

```sh
jsrepo add button --overwrite
```

### `--registry` [#--registry]

The registry to add items from:

```sh
jsrepo add button --registry @ieedan/shadcn-svelte-extras
```

### `--verbose` [#--verbose]

Include debug logs:

```sh
jsrepo add button --verbose
```

### `--with` [#--with]

Include files with the given roles:

```sh
jsrepo add --with example test storybook
```

### `--with-docs` (Deprecated) [#--with-docs-deprecated]

Use `--with doc`:

```sh
jsrepo add --with-docs
```

### `--with-examples` (Deprecated) [#--with-examples-deprecated]

Use `--with example`:

```sh
jsrepo add --with-examples
```

### `--with-tests` (Deprecated) [#--with-tests-deprecated]

Use `--with test`:

```sh
jsrepo add --with-tests
```

### `--yes` [#--yes]

Skip the confirmation prompt:

```sh
jsrepo add button --yes
```


# build (/docs/cli/build)

```sh
jsrepo build
```

## Usage [#usage]

Build all blocks from the registries in your `jsrepo.config` file:

```sh
jsrepo build
```

Build blocks and watch for changes:

```sh
jsrepo build --watch
```

## Options [#options]

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo build --cwd ./my-project
```

### `--debounce`, `-d` [#--debounce--d]

How long to wait before building again after a change is detected (watch mode only):

```sh
jsrepo build --watch --debounce 200
```

### `--watch`, `-w` [#--watch--w]

Watch for changes and rebuild automatically:

```sh
jsrepo build --watch
```

# list (/docs/cli/list)

```sh
jsrepo list
```

`list` outputs a list of available registry items.

## Usage [#usage]

List items from the registries in your `jsrepo.config` file:

```sh
jsrepo list
```

List items from one or more specific registries:

```sh
jsrepo list @ieedan/std
```

```sh
jsrepo list @ieedan/std github/owner/repo
```

Items are always grouped under their registry:

```
@ieedan/std
  math
  result

github/owner/repo
  button — Button
    A reusable button component.
```

Each item shows its identifier (`name`). When a `title` or `description` is available, those are included as well.

Output as JSON:

```sh
jsrepo list @ieedan/std --json
```

```json
{
	"registries": [
		{
			"url": "@ieedan/std",
			"items": [
				{
					"name": "math"
				},
				{
					"name": "result",
					"title": "Result",
					"description": "A Result type for error handling."
				}
			]
		}
	]
}
```

## Options [#options]

### `--all` [#--all]

Include `when-needed` and `index` items. By default, only `when-added` items are shown:

```sh
jsrepo list @ieedan/std --all
```

### `--detail` [#--detail]

Control how much information is shown for each item. Accepts `basic` (default) or `full`:

```sh
jsrepo list @ieedan/std --detail full
```

With `--detail full`, each item also includes type, add policy, categories, dependencies, env vars, meta, and files:

```
@ieedan/std
  math
    type: util
    add: when-added
    registry dependencies: types
    files:
      math.ts
      math.test.ts [test]
```

When combined with `--json --detail full`, the full manifest item data is included in the JSON output.

### `--json` [#--json]

Output as JSON instead of formatted text:

```sh
jsrepo list @ieedan/std --json
```

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo list --cwd ./my-project
```

### `--verbose` [#--verbose]

Include debug logs:

```sh
jsrepo list @ieedan/std --verbose
```


# publish (/docs/cli/publish)

```sh
jsrepo publish
```

## Usage [#usage]

Publish all registries in your `jsrepo.config` file:

```sh
jsrepo publish
```

Publish a specific registry:

```sh
jsrepo publish @jsrepo/playground
```

Publish in dry run mode:

```sh
jsrepo publish --dry-run
```

## Options [#options]

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo build --cwd ./my-project
```

### `--dry-run` [#--dry-run]

Publish in dry run mode. This will check with jsrepo.com to see if the registry can be published in it's current state:

```sh
jsrepo publish --dry-run
```

### `--verbose` [#--verbose]

Include debug logs:

```sh
jsrepo publish --verbose
```


# update (/docs/cli/update)

```sh
jsrepo update
```

## Usage [#usage]

Update an item in your project:

```sh
jsrepo update button
```

Select which items from your project that you want to update:

```sh
jsrepo update
```

```
◆  Which items would you like to update?
│  ■ button
│  □ math
│  □ logger
└
```

Update an item from a specific registry:

```sh
jsrepo update @ieedan/shadcn-svelte-extras/button
```

Update all items in your project:

```sh
jsrepo update --all
```

## Options [#options]

### `--all` [#--all]

Update all items in your project:

```sh
jsrepo update --all
```

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo update button --cwd ./my-project
```

### `--expand` [#--expand]

Expands the diff so you see the entire file:

```sh
jsrepo update button --expand
```

### `--max-unchanged` [#--max-unchanged]

Maximum unchanged lines that will show without being collapsed:

```sh
jsrepo update button --max-unchanged 20
```

### `--overwrite` [#--overwrite]

Overwrite files without prompting:

```sh
jsrepo update button --overwrite
```

### `--registry` [#--registry]

The registry to update items from:

```sh
jsrepo update button --registry @ieedan/shadcn-svelte-extras
```

### `--verbose` [#--verbose]

Include debug logs:

```sh
jsrepo update button --verbose
```

### `--with` [#--with]

Include files with the given roles:

```sh
jsrepo update --with example test storybook
```

### `--with-docs` (Deprecated) [#--with-docs-deprecated]

Use `--with doc`:

```sh
jsrepo update --with-docs
```

### `--with-examples` (Deprecated) [#--with-examples-deprecated]

Use `--with example`:

```sh
jsrepo update --with-examples
```

### `--with-tests` (Deprecated) [#--with-tests-deprecated]

Use `--with test`:

```sh
jsrepo update --with-tests
```

### `--yes` [#--yes]

Skip the confirmation prompt:

```sh
jsrepo update button --yes
```


# language (/docs/cli/config/language)

```sh
jsrepo config language
```

## Usage [#usage]

Add a language to your config. You will be prompted to install dependencies after adding:

```sh
jsrepo config language jsrepo-language-go
```

Add multiple languages at once:

```sh
jsrepo config language jsrepo-language-go jsrepo-language-rust
```

## Options [#options]

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo config language jsrepo-language-go --cwd ./my-project
```

### `--yes` [#--yes]

Skip the confirmation prompt:

```sh
jsrepo config language jsrepo-language-go --yes
```


# mcp (/docs/cli/config/mcp)

```sh
jsrepo config mcp
```

## Usage [#usage]

Configure the jsrepo MCP server. You will be prompted to select which clients to configure:

```sh
jsrepo config mcp
```

You will be prompted to select which clients you want to configure:

```
◆  Which clients would you like to configure?
│  ■ Cursor
│  □ Claude Code
│  □ VS Code
│  □ Codex
└
```

Configure a specific client:

```sh
jsrepo config mcp --client cursor
```

Configure multiple clients:

```sh
jsrepo config mcp --client cursor vscode
```

Configure all supported MCP clients:

```sh
jsrepo config mcp --all
```

## Options [#options]

### `--all` [#--all]

Configure all supported MCP clients:

```sh
jsrepo config mcp --all
```

### `--client` [#--client]

The MCP client(s) to configure. Supported clients: `cursor`, `claude`, `vscode`, `codex`:

```sh
jsrepo config mcp --client cursor
```

Configure multiple clients:

```sh
jsrepo config mcp --client cursor vscode
```

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo config mcp --cwd ./my-project
```


# provider (/docs/cli/config/provider)

```sh
jsrepo config provider
```

## Usage [#usage]

Add a provider to your config. You will be prompted to install dependencies after adding:

```sh
jsrepo config provider jsrepo-provider-jsr
```

Add multiple providers at once:

```sh
jsrepo config provider jsrepo-provider-jsr jsrepo-provider-npm
```

## Options [#options]

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo config provider jsrepo-provider-jsr --cwd ./my-project
```

### `--yes` [#--yes]

Skip the confirmation prompt:

```sh
jsrepo config provider jsrepo-provider-jsr --yes
```


# transform (/docs/cli/config/transform)

```sh
jsrepo config transform
```

## Usage [#usage]

Add a transform to your config. You will be prompted to install dependencies after adding:

```sh
jsrepo config transform @jsrepo/transform-prettier
```

Add multiple transforms at once:

```sh
jsrepo config transform @jsrepo/transform-prettier @jsrepo/transform-biome
```

## Options [#options]

### `--cwd` [#--cwd]

The current working directory:

```sh
jsrepo config transform @jsrepo/transform-prettier --cwd ./my-project
```

### `--yes` [#--yes]

Skip the confirmation prompt:

```sh
jsrepo config transform @jsrepo/transform-prettier --yes
```


# Languages (/docs/languages)

**jsrepo** uses languages to determine the dependencies of registry items when you run the `build` command and also how to add and install dependencies.

<Callout type="info">
	**jsrepo** can distribute code of any language or file type but these are the languages that support [dependency
	resolution](#what-is-dependency-resolution).
</Callout>

## Available Languages [#available-languages]

By default **jsrepo** supports the following languages:

<Cards>
	<Card href="/docs/languages/js" icon={<JavaScriptLogo />} title="JavaScript">
		Support for `*.js`, `*.ts`, `*.jsx`, `*.tsx`, `*.mjs`, `*.mts` files.
	</Card>
	<Card href="/docs/languages/svelte" icon={<SvelteLogo />} title="Svelte">
		Support for `*.svelte` files.
	</Card>
	<Card href="/docs/languages/vue" icon={<VueLogo />} title="Vue">
		Support for `*.vue` files.
	</Card>
	<Card href="/docs/languages/css" icon={<CSSLogo />} title="CSS">
		Support for `*.css`, `*.scss`, `*.sass` files.
	</Card>
	<Card href="/docs/languages/html" icon={<HTML5Logo />} title="HTML">
		Support for `*.html` files.
	</Card>
</Cards>

## What is dependency resolution? [#what-is-dependency-resolution]

Dependency resolution is the process of determining the dependencies of a registry item. This process ensures that when you add a registry item that all of it's dependencies are also added.

Without dependency resolution you need to manually specify dependencies of a registry item which is cumbersome and error prone.

### How to manually specify dependencies [#how-to-manually-specify-dependencies]

If your language of choice doesn't support dependency resolution or your registry items have dependencies that cannot be automatically detected you can manually specify them like so:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { js } from "jsrepo/langs";

export default defineConfig({
	registry: {
		items: [
			{
				name: "button",
				type: "component",
				files: [
					{
						path: "src/components/button.tsx",
					},
				],
				registryDependencies: ["utils"], // [!code ++]
				dependencies: [
					// [!code ++]
					{
						// [!code ++]
						ecosystem: "js", // [!code ++]
						name: "radix-ui", // [!code ++]
						version: "1.4.3", // [!code ++]
					}, // [!code ++]
				], // [!code ++]
			},
		],
	},
});
```

### How to prevent automatic dependency resolution [#how-to-prevent-automatic-dependency-resolution]

If you want to opt out of automatic dependency resolution you can do so by setting the `dependencyResolution` option to `manual` on the registry item or on the file itself.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { js } from "jsrepo/langs";

export default defineConfig({
	registry: {
		items: [
			{
				name: "button",
				type: "component",
				// for the entire item
				dependencyResolution: "manual", // [!code ++]
				files: [
					{
						path: "src/components/button.tsx",
						// for individual files
						dependencyResolution: "manual", // [!code ++]
					},
				],
			},
		],
	},
});
```

### Strict mode [#strict-mode]

By default **jsrepo** will error if it cannot resolve all dependencies of a registry item. You can opt out of this behavior by setting the `strict` option to `false`.

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { js } from "jsrepo/langs";

export default defineConfig({
	registry: {
		items: [
			{
				name: "button",
				type: "component",
				strict: false, // [!code ++]
			},
		],
	},
});
```


# css (/docs/languages/css)

<BadgeGroup>
	<SourceBadge path="packages/jsrepo/src/langs/css.ts" />
	<OfficialBadge />
	<DefaultBadge />
</BadgeGroup>

The `css` language plugin supports dependency resolution for CSS, SCSS, and Sass files as well as installing dependencies with `ecosystem: "js"`.

## Supported syntax [#supported-syntax]

The CSS plugin uses the [css-dependency](https://www.npmjs.com/package/css-dependency) library under the hood to detect dependencies. So it supports all the following syntax:

-   `@import` statements
-   `@plugin` statements (if `allowTailwindDirectives` is `true`)
-   `@config` statements (if `allowTailwindDirectives` is `true`)
-   `@reference` statements (if `allowTailwindDirectives` is `true`)

By default `allowTailwindDirectives` is `true` so it will also detect Tailwind directives as imports. To opt out of this behavior you can set `allowTailwindDirectives` to `false`.

```ts
import { defineConfig } from "jsrepo";
import { css } from "jsrepo/langs";

export default defineConfig({
	languages: [css({ allowTailwindDirectives: false })], // [!code ++]
});
```
## Supported File Extensions [#supported-file-extensions]

The CSS language plugin supports the following file extensions:

| Extension |
| --------- |
| `.css`    |
| `.scss`   |
| `.sass`   |


# svelte (/docs/languages/svelte)

<BadgeGroup>
	<SourceBadge path="packages/jsrepo/src/langs/svelte.ts" />
	<OfficialBadge />
	<DefaultBadge />
</BadgeGroup>

The `svelte` language plugin supports dependency resolution for Svelte files as well as installing dependencies with `ecosystem: "js"`.

<Callout type="warning">
	This language plugin requires `svelte` to be installed in your project.
</Callout>

## Supported syntax [#supported-syntax]

The Svelte plugin parses all script tags and passes the code to the [JavaScript plugin](/docs/languages/js) to resolve dependencies so all the same syntax is supported.

## Supported File Extensions [#supported-file-extensions]

The JavaScript language plugin supports the following file extensions:

| Extension |
| --------- |
| `.svelte` |


# Outputs (/docs/outputs)

Outputs allow you to customize the way your registry is distributed, or (more generally) what to do with the registry after it's built.

This isn't limited into building your registry into a format that **jsrepo** can understand you could use it to output documentation or a manifest for your own CLI application.

By default **jsrepo** ships with two output types:

- [Distributed](/docs/outputs/distributed) - Output your registry as json files in a directory.
- [Repository](/docs/outputs/repository) - Output your registry as a single json file in the root of your repository.

Here are all the officially available outputs:

<Cards>
	<Card href="/docs/outputs/distributed" icon={<SplitIcon />} title="Distributed">
		Output your registry as json files in a directory.
	</Card>
	<Card href="/docs/outputs/repository" icon={<FolderIcon />} title="Repository">
		Output your registry as a single json file in the root of your repository.
	</Card>
    <Card href="/docs/outputs/shadcn" icon={<ShadcnLogo />} title="shadcn">
		Output your registry as a shadcn registry.
	</Card>
</Cards>

## Creating a custom output [#creating-a-custom-output]

You can create your own output either inline in your config file or as a standalone package.

For this example we will create a standalone package that outputs your registry as a markdown file called `REGISTRY.md`.

Let's create our `output.ts` file and import the `Output` type from `jsrepo/outputs`:

```ts
import type { Output } from "jsrepo/outputs";

export function output(): Output {
    return {
        
    }
}
```

Next let's define the `output` key to define how the registry should be output:

```ts title="src/output.ts"
import type { Output } from "jsrepo/outputs";

export const OUTPUT_FILE = "REGISTRY.md";

export function output(): Output {
    return {
        output: async (buildResult, { cwd }) => { // [!code ++]
            let content = `# ${buildResult.name}\n\n`; // [!code ++]
            // [!code ++]
            for (const item of buildResult.items) { // [!code ++]
                content += `## ${item.name}\n\n${item.description}\n\n`; // [!code ++]
            } // [!code ++]
            // [!code ++]
            fs.writeFileSync(path.join(cwd, OUTPUT_FILE), content); // [!code ++]
        }, // [!code ++]
    }
}
```

<Callout type="info">
    The `buildResult` object contains a bunch of useful information about the registry. You can find the full type [here](https://github.com/jsrepojs/jsrepo/blob/next/packages/jsrepo/src/utils/build.ts#L31).
</Callout>

Finally we can define the `clean` key to define how to remove the output file before the next build:

```ts title="src/output.ts"
import type { Output } from "jsrepo/outputs";

export const OUTPUT_FILE = "REGISTRY.md";

export function output(): Output {
    return {
        output: async (buildResult, { cwd }) => {
            let content = `# ${buildResult.name}\n\n`;

            for (const item of buildResult.items) {
                content += `## ${item.name}\n\n${item.description}\n\n`;
            }

            fs.writeFileSync(path.join(cwd, OUTPUT_FILE), content);
        },
        clean: async ({ cwd }) => { // [!code ++]
            const manifestPath = path.join(cwd, OUTPUT_FILE); // [!code ++]
            if (!fs.existsSync(manifestPath)) return; // [!code ++]
            fs.rmSync(manifestPath); // [!code ++]
        }, // [!code ++]
    }
}
```

Now we can use the output in our config file:

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { output } from "./src/output";

export default defineConfig({
    registry: {
        name: "my-registry",
        outputs: [output()],
        // ...
    }
});
```

And the result should look like this:

```markdown title="REGISTRY.md"
# my-registry

## button

A button component.

```


# Distributed (/docs/outputs/distributed)

<BadgeGroup>
	<SourceBadge path="packages/jsrepo/src/outputs/distributed.ts" />
	<OfficialBadge />
</BadgeGroup>

The `distributed` output is used for maximizing performance when serving your registry as a static asset.

## Usage [#usage]

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { distributed } from "jsrepo/outputs"; // [!code ++]

export default defineConfig({
	registry: {
		outputs: [distributed({ dir: "./public/r" })], // [!code ++]
	},
});
```

Now running `jsrepo build` will output your registry to the `./public/r` directory.

Unlike the `repository` output, the `distributed` output will output each item as a separate json file. For example:

<Files>
	<Folder name="public" defaultOpen>
		<Folder name="r" defaultOpen>
			<File name="registry.json" />
			<File name="button.json" />
			<File name="utils.json" />
		</Folder>
	</Folder>
</Files>

Since each item file contains all the code for all the files required for that item this is much more performant, and portable than the `repository` output.


# Repository (/docs/outputs/repository)

<BadgeGroup>
	<SourceBadge path="packages/jsrepo/src/outputs/distributed.ts" />
	<OfficialBadge />
</BadgeGroup>

The `repository` output is used when you are serving your registry from a repository and want to minimize code duplication and tracked files.

## Usage [#usage]

```ts title="jsrepo.config.ts"
import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs"; // [!code ++]

export default defineConfig({
	registry: {
		outputs: [repository()], // [!code ++]
	},
});
```

Now running `jsrepo build` will output a `registry.json` file to the root of your repository.


