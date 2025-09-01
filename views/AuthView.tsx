
import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { generateTeamBranding } from &apos;../services/geminiService&apos;;
import { LazyImage } from &apos;../components/ui/LazyImage&apos;;
import { authService } from &apos;../services/authService&apos;;
import type { AuthResponse } from &apos;../services/authService&apos;;
import { SparklesIcon } from &apos;../components/icons/SparklesIcon&apos;;
import { ErrorBoundary } from &apos;../components/ui/ErrorBoundary&apos;;

type AuthMode = &apos;login&apos; | &apos;register&apos;;

interface AuthViewProps {
}
  // No props currently needed, but interface ready for future expansion

}

const AuthView: React.FC<AuthViewProps> = () => {
}
    const { dispatch } = useAppState();
    const [mode, setMode] = React.useState<AuthMode>(&apos;login&apos;);
    const [formData, setFormData] = React.useState({
}
        username: &apos;&apos;,
        email: &apos;&apos;,
        password: &apos;&apos;,
        displayName: &apos;&apos;,
        confirmPassword: &apos;&apos;
    });
    const [avatar, setAvatar] = React.useState(&apos;🏈&apos;);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
}
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value )};
        if (error) setError(null); // Clear error when user starts typing
    };

    const validateForm = (): string | null => {
}
        if (mode === &apos;register&apos;) {
}
            if (!formData.username.trim()) return &apos;Username is required&apos;;
            if (!formData.email.trim()) return &apos;Email is required&apos;;
            if (!formData.password) return &apos;Password is required&apos;;
            if (formData.password !== formData.confirmPassword) return &apos;Passwords do not match&apos;;
            if (formData.password.length < 8) return &apos;Password must be at least 8 characters&apos;;
            if (!/\S+@\S+\.\S+/.test(formData.email)) return &apos;Please enter a valid email&apos;;
        } else {
}
            if (!formData.username.trim()) return &apos;Username is required&apos;;
            if (!formData.password) return &apos;Password is required&apos;;

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
}
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
}
            setError(validationError);
            return;

        setIsSubmitting(true);
        setError(null);

        try {
}
            let response: AuthResponse;
            
            if (mode === &apos;register&apos;) {
}
                response = await authService.register(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.displayName || formData.username
                );
                
                if (response.success) {
}
                    // Auto-login after successful registration
                    response = await authService.login(formData.username, formData.password);

            } else {
}
                response = await authService.login(formData.username, formData.password);

            if (response.success && response.data) {
}
                // Update app state with authenticated user
                dispatch({
}
                    type: &apos;LOGIN&apos;,
                    payload: {
}
                        id: response.data.user.id.toString(),
                        name: response.data.user.display_name || response.data.user.username,
                        avatar,
                        isCommissioner: true, // You might want to get this from the user data
                        memberSince: new Date(response.data.user.created_at).getTime(),

                });

                dispatch({
}
                    type: &apos;ADD_NOTIFICATION&apos;,
                    payload: {
}
                        message: `Welcome ${response.data.user.display_name || response.data.user.username}!`,
                        type: &apos;SYSTEM&apos;

                });
            } else {
}
                setError(response.error || &apos;Authentication failed&apos;);

        } catch (error) {
}
            setError(&apos;Something went wrong. Please try again.&apos;);
        } finally {
}
            setIsSubmitting(false);

    };
    
    const handleGenerate = async () => {
}
        const nameToUse = formData.displayName || formData.username;
        if (!nameToUse.trim()) {
}
            setError("Please enter a name first.");
            return;

        setIsGenerating(true);
        try {
}

            const branding = await generateTeamBranding(nameToUse);
            if (branding) {
}
                setAvatar(branding.avatar);

    } catch (error) {
}
        console.error(error);
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
}
                                mode === &apos;login&apos; ? &apos;bg-cyan-500 text-white shadow-lg&apos; : &apos;text-gray-300 hover:text-white hover:bg-gray-700/50&apos;
                            }`}
                        >
//                             Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode(&apos;register&apos;)}`}
                        >
//                             Register
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-4 text-white">
                    {mode === &apos;login&apos; ? &apos;Welcome Back&apos; : &apos;Create Your Manager Profile&apos;}
                </h2>

                {error && (
}
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-md text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
//                             Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
//                             required
                        />
                    </div>

                    {mode === &apos;register&apos; && (
}
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
//                                     Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
//                                     required
                                />
                            </div>

                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-200 mb-1">
                                    Display Name (Optional)
                                </label>
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Alex Johnson"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
//                             Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
//                             required
                        />
                    </div>

                    {mode === &apos;register&apos; && (
}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
//                                 required
                            />
                        </div>
                    )}

                    {mode === &apos;register&apos; && (
}
                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-200 mb-1">
                                Avatar (Emoji)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="avatar"
                                    type="text"
                                    value={avatar}
                                    onChange={(e: any) => setAvatar(e.target.value)}
                                    maxLength={2}
                                    placeholder="🏈"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleGenerate}
                                    className="p-3 bg-purple-500/20 text-purple-300 rounded-md hover:bg-purple-500/30 disabled:opacity-50"
                                >
                                    {isGenerating ? (
}
                                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                    ) : (
                                        <SparklesIcon />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button-primary w-full mt-6 py-3 font-bold"
                >
                    {isSubmitting ? (
}
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                            {mode === &apos;login&apos; ? &apos;Signing In...&apos; : &apos;Creating Account...&apos;}
                        </div>
                    ) : (
                        mode === &apos;login&apos; ? &apos;Sign In&apos; : &apos;Start My Dynasty&apos;
                    )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-300">
                    {mode === &apos;login&apos; ? (
}
                        <span>
                            Don&apos;t have an account?{&apos; &apos;}
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Sign up
                            </button>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{&apos; &apos;}
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Sign in
                            </button>
                        </span>
                    )}
                </div>
            </motion.form>
        </div>
    );
};

const AuthViewWithErrorBoundary: React.FC<AuthViewProps> = (props: any) => (
    <ErrorBoundary>
        <AuthView {...props} />
    </ErrorBoundary>
);

export default AuthViewWithErrorBoundary;
