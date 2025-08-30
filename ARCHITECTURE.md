# 🏗️ Architecture Overview - AstralDraft

## 🎯 **System Architecture**

### **Frontend Stack**
- **React 18** - Component-based UI with hooks and context
- **TypeScript** - Type-safe development with strict mode
- **Vite** - Fast build tool with HMR and optimized production builds
- **TailwindCSS** - Utility-first styling with custom design system
- **Framer Motion** - Animation library for smooth transitions

### **Styling Architecture**
```
/styles/
├── globals.css        # Base styles and design system
├── design-system.css  # Component-specific styling (legacy)
└── tailwind.config.js # Tailwind configuration and theme
```

### **Component Architecture**
```
/components/
├── analytics/    # Data visualization and statistics
├── auth/         # Authentication components
├── draft/        # Live drafting interface
├── icons/        # SVG icon components
├── league/       # League management
├── player/       # Player-related components
├── social/       # Messaging and activity
├── trade/        # Trading interface
└── ui/           # Reusable UI primitives
```

## 🔧 **Key Architectural Decisions**

### **1. Design System Approach**
- **Utility-First**: TailwindCSS for rapid development
- **Component Variants**: Modular design with size/style variants
- **CSS Variables**: Dynamic theming with custom properties
- **Glassmorphism**: Consistent backdrop-filter effects

### **2. State Management**
- **React Context**: Global league and user state
- **Local State**: Component-specific state with hooks
- **Caching**: Smart data persistence with local storage
- **No Redux**: Simplified state management approach

### **3. Performance Optimizations**
- **Code Splitting**: Route-based and component-based lazy loading
- **Bundle Analysis**: Optimized imports and tree shaking
- **CSS Optimization**: PurgeCSS and minification
- **Image Optimization**: WebP format with fallbacks

### **4. Animation Strategy**
- **CSS-First**: GPU-accelerated CSS animations where possible
- **Framer Motion**: Complex animations and page transitions
- **Reduced Motion**: Respects user accessibility preferences
- **Performance**: Avoid layout thrashing with transform-only animations

## 🎨 **Design System Architecture**

### **Color System**
```css
/* Semantic Colors */
primary: Electric Blue (#5e6bff)
secondary: Emerald Green (#10b981)  
accent: Cyan (#06b6d4)

/* Position Colors */
qb: Red (#ef4444)
rb: Green (#10b981)
wr: Blue (#3b82f6)
te: Amber (#f59e0b)
k: Purple (#8b5cf6)
def: Pink (#ec4899)
```

### **Typography Scale**
```css
/* Headers */
H1: 4xl-6xl (2.25rem - 3.75rem)
H2: 3xl-5xl (1.875rem - 3rem)
H3: 2xl-4xl (1.5rem - 2.25rem)

/* Body */
Base: 1rem (16px)
Large: 1.125rem (18px)
Small: 0.875rem (14px)
Caption: 0.75rem (12px)
```

### **Spacing System**
- **8px Grid**: Consistent spacing multiples of 8px
- **Responsive**: Adaptive spacing based on breakpoints
- **Semantic**: Padding and margin with meaningful names

## 🔗 **Data Flow**

### **Client-Side Architecture**
```
User Interaction 
    ↓
Component State Update
    ↓
Context/Service Layer
    ↓
Local Storage Cache
    ↓
UI Re-render with Animation
```

### **Real-time Updates**
- **WebSockets**: Live draft and scoring updates
- **Polling**: Fallback for critical data updates
- **Optimistic Updates**: Immediate UI feedback

## 📱 **Responsive Strategy**

### **Breakpoint System**
```css
xs: 475px   (Small phones)
sm: 640px   (Large phones)
md: 768px   (Tablets)
lg: 1024px  (Small laptops)
xl: 1280px  (Desktops)
2xl: 1536px (Large screens)
```

### **Mobile-First Approach**
- **Touch Targets**: Minimum 44px tap areas
- **Navigation**: Thumb-friendly bottom navigation
- **Typography**: Readable font sizes on small screens
- **Performance**: Optimized for mobile networks

## 🚀 **Build & Deployment**

### **Development**
```bash
npm run dev     # Vite dev server with HMR
npm run build   # Production build
npm run preview # Preview production build
```

### **Production Optimizations**
- **Asset Optimization**: Image compression and format selection
- **Code Splitting**: Automatic route and component splitting
- **Tree Shaking**: Remove unused code from bundle
- **Minification**: CSS and JavaScript compression

### **Deployment Strategy**
- **Static Build**: Generated static files for CDN deployment
- **Relative Paths**: Compatible with subdirectory deployment
- **Progressive Enhancement**: Works without JavaScript for core functionality