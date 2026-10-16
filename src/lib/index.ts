/**
 * @fractaldesign/fractalsvelte-ui
 * Massive, token-driven Svelte 5 runes component library for SvelteKit.
 * Zero Tailwind. Scoped CSS. Precision ergonomics.
 */

// Types, Transitions, and Design Tokens
export * from './types';
export * from './transitions';
export * from './view-transitions';
export { themeState } from './theme.svelte';

// Documentation components
export { default as ComponentPreview } from './components/doc/ComponentPreview.svelte';
export { default as PropsTable } from './components/doc/PropsTable.svelte';
export { default as ThemeToggle } from './components/doc/ThemeToggle.svelte';

// Actions & Triggers
export { default as Button } from './components/actions/Button.svelte';
export { default as IconButton } from './components/actions/IconButton.svelte';
export { default as ButtonGroup } from './components/actions/ButtonGroup.svelte';
export { default as SplitButton } from './components/actions/SplitButton.svelte';
export { default as LinkButton } from './components/actions/LinkButton.svelte';
export { default as CloseButton } from './components/actions/CloseButton.svelte';
export { default as CopyButton } from './components/actions/CopyButton.svelte';
export { default as HoldToConfirm } from './components/actions/HoldToConfirm.svelte';
export { default as SlideUnlock } from './components/actions/SlideUnlock.svelte';

// Forms & Inputs
export { default as Input } from './components/forms/Input.svelte';
export { default as TextArea } from './components/forms/TextArea.svelte';
export { default as Checkbox } from './components/forms/Checkbox.svelte';
export { default as Radio } from './components/forms/Radio.svelte';
export { default as RadioGroup } from './components/forms/RadioGroup.svelte';
export type { RadioOption } from './components/forms/RadioGroup.svelte';
export { default as Switch } from './components/forms/Switch.svelte';
export { default as Select } from './components/forms/Select.svelte';
export type { SelectOption } from './components/forms/Select.svelte';
export { default as Slider } from './components/forms/Slider.svelte';
export { default as RangeSlider } from './components/forms/RangeSlider.svelte';
export { default as PinInput } from './components/forms/PinInput.svelte';
export { default as NumberInput } from './components/forms/NumberInput.svelte';
export { default as SearchInput } from './components/forms/SearchInput.svelte';
export { default as ColorPicker } from './components/forms/ColorPicker.svelte';
export { default as FileInput } from './components/forms/FileInput.svelte';
export { default as FormField } from './components/forms/FormField.svelte';
export { default as TagInput } from './components/forms/TagInput.svelte';
export { default as RotaryDial } from './components/forms/RotaryDial.svelte';

// Display & Feedback
export { default as Badge } from './components/display/Badge.svelte';
export { default as Tag } from './components/display/Tag.svelte';
export { default as Avatar } from './components/display/Avatar.svelte';
export { default as AvatarGroup } from './components/display/AvatarGroup.svelte';
export { default as Kbd } from './components/display/Kbd.svelte';
export { default as Alert } from './components/display/Alert.svelte';
export { default as Banner } from './components/display/Banner.svelte';
export { default as Progress } from './components/display/Progress.svelte';
export { default as Meter } from './components/display/Meter.svelte';
export { default as Spinner } from './components/display/Spinner.svelte';
export { default as Skeleton } from './components/display/Skeleton.svelte';
export { default as EmptyState } from './components/display/EmptyState.svelte';
export { default as StatCard } from './components/display/StatCard.svelte';
export { default as AspectRatio } from './components/display/AspectRatio.svelte';
export { default as Sparkline } from './components/display/Sparkline.svelte';
export { default as DotMatrix } from './components/display/DotMatrix.svelte';
export { default as SizeReadout } from './components/display/SizeReadout.svelte';
export { default as Counter } from './components/display/Counter.svelte';

// Layout & Containers
export { default as Card } from './components/layout/Card.svelte';
export type { CardVariant, CardElevation, CardRadius } from './components/layout/Card.svelte';
export { default as SelectableCard } from './components/layout/SelectableCard.svelte';
export type { SelectableCardType, IndicatorPosition } from './components/layout/SelectableCard.svelte';
export { default as ClickableCard } from './components/layout/ClickableCard.svelte';
export { default as Container } from './components/layout/Container.svelte';
export type { ContainerSize } from './components/layout/Container.svelte';
export { default as Stack } from './components/layout/Stack.svelte';
export type { StackDirection } from './components/layout/Stack.svelte';
export { default as Flex } from './components/layout/Flex.svelte';
export type { FlexWrap } from './components/layout/Flex.svelte';
export { default as Grid } from './components/layout/Grid.svelte';
export type { GridColumns, GridJustify } from './components/layout/Grid.svelte';
export { default as BentoGrid } from './components/layout/BentoGrid.svelte';
export { default as BentoCell } from './components/layout/BentoCell.svelte';
export type { BentoCellVariant } from './components/layout/BentoCell.svelte';
export { default as Section } from './components/layout/Section.svelte';
export type { SectionSpacing, SectionAlign } from './components/layout/Section.svelte';
export { default as Divider } from './components/layout/Divider.svelte';
export type { DividerVariant, DividerLabelPosition } from './components/layout/Divider.svelte';
export { default as SplitPane } from './components/layout/SplitPane.svelte';
export { default as DataTable } from './components/layout/DataTable.svelte';
export type { DataColumn } from './components/layout/DataTable.svelte';

// Navigation & Shells
export { default as AppShell } from './components/navigation/AppShell.svelte';
export { default as Header } from './components/navigation/Header.svelte';
export { default as TopNav } from './components/navigation/TopNav.svelte';
export { default as SideNav } from './components/navigation/SideNav.svelte';
export { default as BottomNav } from './components/navigation/BottomNav.svelte';
export { default as Breadcrumb } from './components/navigation/Breadcrumb.svelte';
export { default as Pagination } from './components/navigation/Pagination.svelte';
export { default as Stepper } from './components/navigation/Stepper.svelte';
export { default as Tabs } from './components/navigation/Tabs.svelte';
export { default as SegmentedControl } from './components/navigation/SegmentedControl.svelte';
export { default as TreeList } from './components/navigation/TreeList.svelte';
export { default as MobileNav } from './components/navigation/MobileNav.svelte';
export { default as MorphingTabs } from './components/navigation/MorphingTabs.svelte';
export type { MorphingTabItem } from './components/navigation/MorphingTabs.svelte';
export { default as Dock } from './components/navigation/Dock.svelte';
export type { DockItemData } from './components/navigation/Dock.svelte';

// Overlays & Popups
export { default as Dialog } from './components/overlays/Dialog.svelte';
export type { DialogSize } from './components/overlays/Dialog.svelte';
export { default as AlertDialog } from './components/overlays/AlertDialog.svelte';
export type { AlertConfirmVariant } from './components/overlays/AlertDialog.svelte';
export { default as Drawer } from './components/overlays/Drawer.svelte';
export type { DrawerPlacement } from './components/overlays/Drawer.svelte';
export { default as Popover } from './components/overlays/Popover.svelte';
export { default as Tooltip } from './components/overlays/Tooltip.svelte';
export type { TooltipPlacement } from './components/overlays/Tooltip.svelte';
export { default as DropdownMenu } from './components/overlays/DropdownMenu.svelte';
export type { DropdownMenuItem } from './components/overlays/DropdownMenu.svelte';
export { default as CommandPalette } from './components/overlays/CommandPalette.svelte';
export type { CommandItem, CommandGroup } from './components/overlays/CommandPalette.svelte';
export { default as Toast } from './components/overlays/Toast.svelte';
export { default as ToastStack } from './components/overlays/ToastStack.svelte';
export type { ToastItem } from './components/overlays/ToastStack.svelte';
export { default as ContextMenu } from './components/overlays/ContextMenu.svelte';
export type { ContextMenuItem } from './components/overlays/ContextMenu.svelte';
export { default as CenterMorphModal } from './components/overlays/CenterMorphModal.svelte';

// Typography & Content
export { default as Heading } from './components/typography/Heading.svelte';
export { default as Text } from './components/typography/Text.svelte';
export { default as Code } from './components/typography/Code.svelte';
export { default as CodeBlock } from './components/typography/CodeBlock.svelte';
export { default as Blockquote } from './components/typography/Blockquote.svelte';
export { default as Collapsible } from './components/typography/Collapsible.svelte';
export { default as Accordion } from './components/typography/Accordion.svelte';

// Motion & Animated
export { default as AnimatedButton } from './components/motion/AnimatedButton.svelte';
export { default as AnimatedCard } from './components/motion/AnimatedCard.svelte';
export { default as Card3D } from './components/motion/Card3D.svelte';
export { default as GlowCard } from './components/motion/GlowCard.svelte';
export { default as ShimmerEffect } from './components/motion/ShimmerEffect.svelte';
export { default as Marquee } from './components/motion/Marquee.svelte';
export { default as TextScramble } from './components/motion/TextScramble.svelte';
export { default as RippleEffect } from './components/motion/RippleEffect.svelte';
export { default as FloatingBadge } from './components/motion/FloatingBadge.svelte';
export { default as CanvasMotion } from './components/motion/CanvasMotion.svelte';
export { default as MagneticButton } from './components/motion/MagneticButton.svelte';
export { default as BorderBeam } from './components/motion/BorderBeam.svelte';
export { default as ConfettiBurst } from './components/motion/ConfettiBurst.svelte';
export { default as EqualizerBars } from './components/motion/EqualizerBars.svelte';
export { default as LidarSweep } from './components/motion/LidarSweep.svelte';
export { default as CardStack } from './components/motion/CardStack.svelte';
export type { CardStackItemData } from './components/motion/CardStack.svelte';
export { default as ClickSpark } from './components/motion/ClickSpark.svelte';
export { default as MagnetLines } from './components/motion/MagnetLines.svelte';
export { default as SpotlightCard } from './components/motion/SpotlightCard.svelte';
export { default as SplitReveal } from './components/motion/SplitReveal.svelte';
export { default as StaggerList } from './components/motion/StaggerList.svelte';
export type { StaggerListItem } from './components/motion/StaggerList.svelte';
export { default as RouteTransition } from './components/motion/RouteTransition.svelte';
export { default as SharedElement } from './components/motion/SharedElement.svelte';

// UI Blocks & Domain Compositions
export { default as WorkflowNode } from './components/blocks/WorkflowNode.svelte';
export { default as FlowCanvas } from './components/blocks/FlowCanvas.svelte';
export { default as HeroBlock } from './components/blocks/HeroBlock.svelte';
export { default as PricingCard } from './components/blocks/PricingCard.svelte';
export { default as FeatureGrid } from './components/blocks/FeatureGrid.svelte';
export { default as TerminalBlock } from './components/blocks/TerminalBlock.svelte';
export { default as ChatBubble } from './components/blocks/ChatBubble.svelte';
export { default as Timeline } from './components/blocks/Timeline.svelte';
export { default as BeforeAfter } from './components/blocks/BeforeAfter.svelte';
