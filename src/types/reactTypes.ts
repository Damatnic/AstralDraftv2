/**
 * Comprehensive React TypeScript Definitions
 * Provides all necessary types for React components in Astral Draft
 */

import { FC, ReactNode, ComponentProps, MouseEvent, ChangeEvent, FormEvent, FocusEvent, KeyboardEvent } from &apos;react&apos;;

// ==========================================
// COMMON COMPONENT PROP INTERFACES
// ==========================================

/**
 * Base props that most components should extend
 */
export interface BaseComponentProps {
}
  className?: string;
  children?: ReactNode;
  &apos;data-testid&apos;?: string;
}

/**
 * Props for components that can be clicked
 */
export interface ClickableProps {
}
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

/**
 * Props for form input components
 */
export interface InputProps {
}
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

/**
 * Props for form components
 */
export interface FormProps {
}
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onReset?: (event: FormEvent<HTMLFormElement>) => void;
}

// ==========================================
// REACT EVENT HANDLER TYPES
// ==========================================

/**
 * Common button click handler
 */
export type ButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => void;

/**
 * Common div click handler
 */
export type DivClickHandler = (event: MouseEvent<HTMLDivElement>) => void;

/**
 * Generic element click handler
 */
export type ElementClickHandler = (event: MouseEvent<HTMLElement>) => void;

/**
 * Input change handler
 */
export type InputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

/**
 * Textarea change handler
 */
export type TextareaChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => void;

/**
 * Select change handler
 */
export type SelectChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => void;

/**
 * Form submit handler
 */
export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;

/**
 * Keyboard event handler
 */
export type KeyboardEventHandler = (event: KeyboardEvent<HTMLElement>) => void;

// ==========================================
// COMPONENT TYPE DEFINITIONS
// ==========================================

/**
 * Functional Component with props
 */
export type ReactFC<P = {}> = FC<P>;

/**
 * Component with children
 */
export interface WithChildren {
}
  children: ReactNode;
}

/**
 * Optional children
 */
export interface WithOptionalChildren {
}
  children?: ReactNode;
}

/**
 * Component with loading state
 */
export interface WithLoading {
}
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Component with error state
 */
export interface WithError {
}
  error?: string | null;
  onClearError?: () => void;
}

// ==========================================
// MODAL AND OVERLAY TYPES
// ==========================================

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
}
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos; | &apos;full&apos;;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Dropdown component props
 */
export interface DropdownProps extends BaseComponentProps {
}
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  position?: &apos;bottom-left&apos; | &apos;bottom-right&apos; | &apos;top-left&apos; | &apos;top-right&apos;;
}

// ==========================================
// FORM COMPONENT TYPES
// ==========================================

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps, ClickableProps {
}
  type?: &apos;button&apos; | &apos;submit&apos; | &apos;reset&apos;;
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;danger&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;info&apos; | &apos;ghost&apos;;
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Input component props
 */
export interface InputComponentProps extends BaseComponentProps, InputProps {
}
  type?: &apos;text&apos; | &apos;email&apos; | &apos;password&apos; | &apos;number&apos; | &apos;tel&apos; | &apos;url&apos; | &apos;search&apos;;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
}

/**
 * Select component props
 */
export interface SelectProps extends BaseComponentProps {
}
  value?: string | number;
  onChange?: SelectChangeHandler;
  options: Array<{
}
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  multiple?: boolean;
}

// ==========================================
// LIST AND TABLE TYPES
// ==========================================

/**
 * List item props
 */
export interface ListItemProps extends BaseComponentProps, ClickableProps {
}
  selected?: boolean;
  active?: boolean;
  variant?: &apos;default&apos; | &apos;compact&apos; | &apos;expanded&apos;;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
}
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: &apos;left&apos; | &apos;center&apos; | &apos;right&apos;;
  render?: (value: any, item: T, index: number) => ReactNode;
}

/**
 * Table component props
 */
export interface TableProps<T = any> extends BaseComponentProps {
}
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T, index: number) => void;
  sortBy?: string;
  sortDirection?: &apos;asc&apos; | &apos;desc&apos;;
  onSort?: (column: string, direction: &apos;asc&apos; | &apos;desc&apos;) => void;
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
}

// ==========================================
// NAVIGATION AND LAYOUT TYPES
// ==========================================

/**
 * Navigation item
 */
export interface NavItem {
}
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

/**
 * Navigation component props
 */
export interface NavigationProps extends BaseComponentProps {
}
  items: NavItem[];
  orientation?: &apos;horizontal&apos; | &apos;vertical&apos;;
  variant?: &apos;default&apos; | &apos;pills&apos; | &apos;underline&apos;;
}

/**
 * Sidebar component props
 */
export interface SidebarProps extends BaseComponentProps {
}
  isOpen?: boolean;
  onToggle?: () => void;
  width?: string | number;
  position?: &apos;left&apos; | &apos;right&apos;;
  overlay?: boolean;
}

// ==========================================
// FEEDBACK COMPONENT TYPES
// ==========================================

/**
 * Alert component props
 */
export interface AlertProps extends BaseComponentProps {
}
  type: &apos;success&apos; | &apos;error&apos; | &apos;warning&apos; | &apos;info&apos;;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}

/**
 * Toast notification props
 */
export interface ToastProps extends Omit<AlertProps, &apos;dismissible&apos;> {
}
  duration?: number;
  position?: &apos;top-left&apos; | &apos;top-right&apos; | &apos;bottom-left&apos; | &apos;bottom-right&apos; | &apos;top-center&apos; | &apos;bottom-center&apos;;
}

/**
 * Loading spinner props
 */
export interface SpinnerProps extends BaseComponentProps {
}
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  color?: string;
  label?: string;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Extract component props from a component type
 */
export type PropsOf<T> = T extends FC<infer P> ? P : never;

/**
 * Make certain props required
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make certain props optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extend HTML element props
 */
export type HTMLProps<T extends HTMLElement> = Omit<ComponentProps<any>, &apos;ref&apos;> & {
}
  ref?: React.Ref<T>;
};

// ==========================================
// ASTRAL DRAFT SPECIFIC TYPES
// ==========================================

/**
 * Player card component props
 */
export interface PlayerCardProps extends BaseComponentProps {
}
  player: any; // Will use Player type from main types file
  onSelect?: (player: any) => void;
  onDeselect?: (player: any) => void;
  selected?: boolean;
  variant?: &apos;compact&apos; | &apos;detailed&apos; | &apos;draft&apos;;
  showStats?: boolean;
  showNotes?: boolean;
  draggable?: boolean;
}

/**
 * Team card component props
 */
export interface TeamCardProps extends BaseComponentProps {
}
  team: any; // Will use Team type from main types file
  onClick?: (team: any) => void;
  selected?: boolean;
  variant?: &apos;compact&apos; | &apos;detailed&apos;;
  showRecord?: boolean;
  showRoster?: boolean;
}

/**
 * Draft component props
 */
export interface DraftComponentProps extends BaseComponentProps {
}
  league: any; // Will use League type from main types file
  onPickPlayer?: (playerId: number, teamId: number) => void;
  onUndoPick?: () => void;
  currentPick?: number;
  timeRemaining?: number;
}

// ==========================================
// EXPORT ALL COMMON REACT TYPES
// ==========================================

// Re-export common React types for convenience
export type {
}
  FC,
  ReactNode,
  ComponentProps,
  MouseEvent,
  ChangeEvent,
  FormEvent,
  FocusEvent,
//   KeyboardEvent
} from &apos;react&apos;;