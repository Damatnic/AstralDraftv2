/**
 * User Settings Component
 * Allows users to update PIN, email, and customization
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Widget } from '../ui/Widget';
import { ShieldIcon, MailIcon, PaletteIcon, UserIcon } from 'lucide-react';

interface Props {
    className?: string;

}

const UserSettings: React.FC<Props> = ({ className = '' }: any) => {
    const { user, updateUserPin, updateUserEmail, updateUserCustomization, updateUserDisplayName } = useAuth();
    
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Form states
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [customization, setCustomization] = useState(user?.customization || {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        emoji: '🏈'
    });

    if (!user) return null;

    const clearMessages = () => {
        setSuccess('');
        setError('');
    };

    const handleDisplayNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) return;

        setIsLoading(true);
        clearMessages();

        try {

            const success = await updateUserDisplayName(displayName.trim());
            if (success) {
                setSuccess('Display name updated successfully!');
            } else {
                setError('Failed to update display name');

    } catch (error) {
            setError('Failed to update display name');
        } finally {
            setIsLoading(false);

    };

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        clearMessages();

        try {

            const success = await updateUserEmail(email.trim());
            if (success) {
                setSuccess('Email updated successfully!');
            } else {
                setError('Failed to update email');

    } catch (error) {
            setError('Failed to update email');
        } finally {
            setIsLoading(false);

    };

    const handlePinUpdate = async () => {
    try {

        e.preventDefault();
        
        if (newPin.length !== 4 || confirmPin.length !== 4) {
            setError('PIN must be 4 digits');
            return;
        
    } catch (error) {
      console.error('Error in handlePinUpdate:', error);

    } catch (error) {
        console.error(error);
    }if (newPin !== confirmPin) {
            setError('PINs do not match');
            return;

        setIsLoading(true);
        clearMessages();

        try {

            const success = await updateUserPin(newPin);
            if (success) {
                setSuccess('PIN updated successfully!');
                setNewPin('');
                setConfirmPin('');
            } else {
                setError('Failed to update PIN');

    } catch (error) {
            setError('Failed to update PIN');
        } finally {
            setIsLoading(false);

    };

    const handleCustomizationUpdate = async () => {
        setIsLoading(true);
        clearMessages();

        try {

            const success = await updateUserCustomization(customization);
            if (success) {
                setSuccess('Appearance updated successfully!');
            } else {
                setError('Failed to update appearance');

    } catch (error) {
            setError('Failed to update appearance');
        } finally {
            setIsLoading(false);

    };

    const colorOptions = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
        '#ec4899', '#6366f1', '#1f2937', '#374151'
    ];

    const emojiOptions = ['🏈', '⚡', '🔥', '💪', '🎯', '🚀', '⭐', '💎', '🏆', '🎮', '🦅', '🐻'];

    const tabs = [
        { id: 'profile' as const, label: 'Profile', icon: UserIcon },
        { id: 'security' as const, label: 'Security', icon: ShieldIcon },
        { id: 'appearance' as const, label: 'Appearance', icon: PaletteIcon }
    ];

    return (
        <Widget title="User Settings" className={`bg-gray-900/50 ${className}`}>
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() = aria-label="Action button"> {
                                    setActiveTab(tab.id);
                                    clearMessages();
                                }}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Success/Error Messages */}
                {(success || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                            success ? 'bg-green-900/50 border border-green-500 text-green-200' : 
                            'bg-red-900/50 border border-red-500 text-red-200'
                        }`}
                    >
                        {success || error}
                    </motion.div>
                )}

                {/* Tab Content */}
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            {/* Display Name */}
                            <form onSubmit={handleDisplayNameUpdate}
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <UserIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Display Name</span>
                                </h3>
                                <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e: any) => setDisplayName(e.target.value)}
                                        className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                                        maxLength={50}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !displayName.trim() || displayName === user.displayName}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                     aria-label="Action button">
                                        Update
                                    </button>
                                </div>
                            </form>

                            {/* Email */}
                            <form onSubmit={handleEmailUpdate}
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <MailIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Recovery Email</span>
                                </h3>
                                <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e: any) => setEmail(e.target.value)}
                                        className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !email.trim() || email === user.email}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                     aria-label="Action button">
                                        Update
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                    Used for PIN recovery and important notifications
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            <form onSubmit={handlePinUpdate}
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <ShieldIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Change PIN</span>
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                                            New PIN
                                        </label>
                                        <input
                                            type="password"
                                            value={newPin}
                                            onChange={(e: any) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            className="w-full bg-gray-700 text-white text-center text-xl tracking-widest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                                            maxLength={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Confirm PIN
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPin}
                                            onChange={(e: any) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            className="w-full bg-gray-700 text-white text-center text-xl tracking-widest rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                                            maxLength={4}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || newPin.length !== 4 || confirmPin.length !== 4}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    {isLoading ? 'Updating...' : 'Update PIN'}
                                </button>
                                
                                <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                    Your PIN must be exactly 4 digits
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <PaletteIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                <span>Customize Appearance</span>
                            </h3>

                            {/* Preview */}
                            <div className="bg-gray-800 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <p className="text-sm text-gray-400 mb-3 sm:px-4 md:px-6 lg:px-8">Preview:</p>
                                <div 
                                    className="inline-flex items-center space-x-3 px-6 py-4 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                    style={{ backgroundColor: customization.backgroundColor }}
                                >
                                    <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{customization.emoji}</span>
                                    <span 
                                        className="font-semibold sm:px-4 md:px-6 lg:px-8"
                                        style={{ color: customization.textColor }}
                                    >
                                        {user.displayName}
                                    </span>
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">
                                    Background Color
                                </label>
                                <div className="grid grid-cols-6 gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {colorOptions.map((color: any) => (
                                        <button
                                            key={color}
                                            onClick={() => setCustomization({ ...customization, backgroundColor: color }}
                                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                                customization.backgroundColor === color
                                                    ? 'border-white scale-110'
                                                    : 'border-gray-600 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Emoji Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">
                                    Emoji
                                </label>
                                <div className="grid grid-cols-6 gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {emojiOptions.map((emoji: any) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setCustomization({ ...customization, emoji }}
                                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                                                customization.emoji === emoji
                                                    ? 'border-blue-500 bg-blue-900/50 scale-110'
                                                    : 'border-gray-600 hover:border-gray-400 hover:bg-gray-700'
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCustomizationUpdate}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                {isLoading ? 'Updating...' : 'Save Appearance'}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Widget>
    );
};

const UserSettingsWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <UserSettings {...props} />
  </ErrorBoundary>
);

export default React.memo(UserSettingsWithErrorBoundary);
