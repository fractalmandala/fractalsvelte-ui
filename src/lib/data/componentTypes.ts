// Base Design Tokens
export type Variant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'soft';
export type Size = 'sm' | 'md' | 'bs' | 'lg';
export type Shape = 'square' | 'modern' | 'curved' | 'round';
export type BannerVariant = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'themed';
export type PadSize = 'none' | 'sm' | 'md' | 'bs' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'search' | 'number';

// State & indicators
export type CheckState = 'checked' | 'unchecked' | 'indeterminate';
export type RadioState = 'checked' | 'unchecked';

// Triggers & animations
export type TextAnimationTrigger = 'hover' | 'click' | 'mount';
export type SwipeDirection = 'left' | 'right';
export type ConfettiShape = 'rect' | 'circle';

// Positioning & placement
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipPosition = 'top' | 'bottom';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastStatus = 'neutral' | 'info' | 'loading' | 'success' | 'error';
export type ToastPlacement = 'static' | 'fixed' | 'absolute';
export type DrawerSide = 'left' | 'right';
export type MarqueeDirection = 'left' | 'right';
export type CookieConsentPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';
export type CookieConsentDecision = 'accepted' | 'rejected';

// Layout & alignment
export type Orientation = 'horizontal' | 'vertical';
export type MenuAlign = 'start' | 'end';
export type TextAlign = 'left' | 'center' | 'right';
export type SortDirection = 'asc' | 'desc';
export type BannerLayout = 'inline' | 'stacked';
export type NavigationEdge = 'first' | 'last';

// Controls & behaviors
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = Variant | 'danger';
export type ButtonSize = Size | 'icon-sm' | 'icon' | 'icon-lg';
export type ButtonShape = Shape | 'pill';
export type IconButtonVariant = Variant | 'solid';
export type ButtonGroupVariant = 'default' | 'segmented';
export type BadgeVariant = BannerVariant | 'neutral' | 'accent';
export type SelectionType = 'single' | 'multiple';
export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

// Menu & context menu
export type ContextMenuItemTone = 'default' | 'destructive';
export type OpenModality = 'pointer' | 'keyboard' | 'touch';
export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

// Animated sidebar
export type SidebarState = 'expanded' | 'collapsed';
export type SidebarSide = 'left' | 'right';
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

// Morphing primitives
export type MorphSide = 'top' | 'bottom';
export type MorphAlign = 'start' | 'end';