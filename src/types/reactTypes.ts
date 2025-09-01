/**
 * Comprehensive React TypeScript Definitions
 * Provides all necessary types for React components in Astral Draft
 */

import { FC, ReactNode, ComponentProps, MouseEvent, ChangeEvent, FormEvent, FocusEvent, KeyboardEvent } from 'react';

// ==========================================
// COMMON COMPONENT PROP INTERFACES
// ==========================================

/**
 * Base props that most components should extend
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

/**
 * Props for components that can be clicked
 */
export interface ClickableProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

/**
 * Props for form input components
 */
export interface InputProps {
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
  children: ReactNode;
}

/**
 * Optional children
 */
export interface WithOptionalChildren {
  children?: ReactNode;
}

/**
 * Component with loading state
 */
export interface WithLoading {
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Component with error state
 */
export interface WithError {
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
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Dropdown component props
 */
export interface DropdownProps extends BaseComponentProps {
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

// ==========================================
// FORM COMPONENT TYPES
// ==========================================

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps, ClickableProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Input component props
 */
export interface InputComponentProps extends BaseComponentProps, InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Select component props
 */
export interface SelectProps extends BaseComponentProps {
  value?: string | number;
  onChange?: SelectChangeHandler;
  options: Array<{
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
  selected?: boolean;
  active?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T, index: number) => ReactNode;
}

/**
 * Table component props
 */
export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T, index: number) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
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
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * Sidebar component props
 */
export interface SidebarProps extends BaseComponentProps {
  isOpen?: boolean;
  onToggle?: () => void;
  width?: string | number;
  position?: 'left' | 'right';
  overlay?: boolean;
}

// ==========================================
// FEEDBACK COMPONENT TYPES
// ==========================================

/**
 * Alert component props
 */
export interface AlertProps extends BaseComponentProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}

/**
 * Toast notification props
 */
export interface ToastProps extends Omit<AlertProps, 'dismissible'> {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

/**
 * Loading spinner props
 */
export interface SpinnerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
export type HTMLProps<T extends HTMLElement> = Omit<ComponentProps<any>, 'ref'> & {
  ref?: React.Ref<T>;
};

// ==========================================
// ASTRAL DRAFT SPECIFIC TYPES
// ==========================================

/**
 * Player card component props
 */
export interface PlayerCardProps extends BaseComponentProps {
  player: any; // Will use Player type from main types file
  onSelect?: (player: any) => void;
  onDeselect?: (player: any) => void;
  selected?: boolean;
  variant?: 'compact' | 'detailed' | 'draft';
  showStats?: boolean;
  showNotes?: boolean;
  draggable?: boolean;
}

/**
 * Team card component props
 */
export interface TeamCardProps extends BaseComponentProps {
  team: any; // Will use Team type from main types file
  onClick?: (team: any) => void;
  selected?: boolean;
  variant?: 'compact' | 'detailed';
  showRecord?: boolean;
  showRoster?: boolean;
}

/**
 * Draft component props
 */
export interface DraftComponentProps extends BaseComponentProps {
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
  FC,
  ReactNode,
  ComponentProps,
  MouseEvent,
  ChangeEvent,
  FormEvent,
  FocusEvent,
  KeyboardEvent
} from 'react';