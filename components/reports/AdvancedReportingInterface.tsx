import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileTextIcon, 
    DownloadIcon, 
    PlusIcon, 
    SettingsIcon,
    BarChart3Icon,
    TrendingUpIcon,
    FilterIcon,
    CalendarIcon,
    EyeIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
//     RefreshCwIcon
} from 'lucide-react';
import { Widget } from '../ui/Widget';
import { useAuth } from '../../contexts/AuthContext';
import { 
    advancedReportingService,
    type ReportTemplate,
    type GeneratedReport,
    type ReportCategory,
    type ExportFormat,
    type AutomatedInsight,
    type CustomDashboard
} from '../../services/advancedReportingService';

interface Props {
    className?: string;

type ReportingTab = 'templates' | 'reports' | 'insights' | 'dashboards' | 'custom';
}

const AdvancedReportingInterface: React.FC<Props> = ({ className = '' 
 }: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<ReportingTab>('templates');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
    const [dashboards, setDashboards] = useState<CustomDashboard[]>([]);

    // UI state
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportParameters, setReportParameters] = useState<Record<string, any>>({});
    const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

    useEffect(() => {
        if (isAuthenticated) {
            loadReportingData();
    }
  }, [isAuthenticated, activeTab, selectedCategory]);

    const loadReportingData = async () => {
        setLoading(true);
        setError(null);

        try {
            switch (activeTab) {
                case 'templates': {
                    const templateList = await advancedReportingService.getReportTemplates(
                        selectedCategory === 'all' ? undefined : selectedCategory
                    );
                    setTemplates(templateList);
                    break;

                case 'reports': {
                    if (user) {
                        const reportHistory = await advancedReportingService.getReportHistory(user.id.toString());
                        setGeneratedReports(reportHistory);

                    break;

                case 'dashboards': {
                    if (user) {
                        const userDashboards = await advancedReportingService.getUserDashboards(user.id.toString());
                        setDashboards(userDashboards);

                    break;


    } catch (error) {
            setError('Failed to load reporting data');
        } finally {
            setLoading(false);

    };

    const handleGenerateReport = async (templateId: string, parameters: Record<string, any> = {}) => {
        if (!user) return;

        setLoading(true);
        try {

            const report = await advancedReportingService.generateReport(
                templateId,
                user.id.toString(),
//                 parameters
            );
            
            setSelectedReport(report);
            setShowReportModal(true);
            
            // Refresh reports list
            if (activeTab === 'reports') {
                await loadReportingData();

    } catch (error) {
            setError('Failed to generate report');
        } finally {
            setLoading(false);

    };

    const handleExportReport = async (reportId: string, format: ExportFormat) => {
        try {

            const blob = await advancedReportingService.exportReport(reportId, format);
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report_${reportId}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        
    `rounded-lg p-4 border ${getInsightSeverityColor(insight.severity)}`}
                        >
                            <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    {insight.severity === 'critical' && <AlertTriangleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                                    {insight.actionable && <CheckCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                                    <h3 className="font-medium sm:px-4 md:px-6 lg:px-8">{insight.title}</h3>
                                </div>
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">
                                        {(insight.confidence * 100).toFixed(0)}% confidence
                                    </span>
                                    <span className="text-xs opacity-75 capitalize sm:px-4 md:px-6 lg:px-8">
                                        {insight.severity}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-sm mb-2 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                            
                            {insight.recommendations && (
                                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="text-sm font-medium opacity-90 sm:px-4 md:px-6 lg:px-8">Recommendations:</h4>
                                    <ul className="text-xs space-y-1 sm:px-4 md:px-6 lg:px-8">
                                        {insight.recommendations.map((rec: string, index: number) => (
                                            <li key={`rec-${insight.id}-${index}`} className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                                                <span className="text-blue-400 sm:px-4 md:px-6 lg:px-8">•</span>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="text-xs opacity-75 mt-2 sm:px-4 md:px-6 lg:px-8">
                                From: {insight.reportTitle}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        );
    };

    const renderDashboards = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Custom Dashboards</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                    <PlusIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    <span>Create Dashboard</span>
                </button>
            </div>

            {dashboards.length === 0 ? (
                <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                    <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">No custom dashboards created yet</p>
                    <p className="text-gray-500 text-sm sm:px-4 md:px-6 lg:px-8">Create personalized dashboards with your favorite metrics</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {dashboards.map((dashboard: any) => (
                        <motion.div
                            key={dashboard.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all sm:px-4 md:px-6 lg:px-8"
                        >
                            <h3 className="font-medium text-white mb-2 sm:px-4 md:px-6 lg:px-8">{dashboard.name}</h3>
                            <p className="text-gray-400 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">{dashboard.description}</p>
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                    {dashboard.widgets.length} widgets • 
                                    {dashboard.isPublic ? ' Public' : ' Private'}
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                                     View
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={`space-y-6 ${className}`}>
            <Widget title="📊 Advanced Reporting" className="overflow-visible sm:px-4 md:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ReportingTab)}`}
                            >
                                <Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 sm:px-4 md:px-6 lg:px-8">
                        <p className="text-red-400 sm:px-4 md:px-6 lg:px-8">{error}</p>
                    </div>
                )}

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-8 sm:px-4 md:px-6 lg:px-8">
                                <RefreshCwIcon className="w-6 h-6 text-blue-400 animate-spin mr-2 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Loading...</span>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'templates' && renderTemplates()}
                                {activeTab === 'reports' && renderReports()}
                                {activeTab === 'insights' && renderInsights()}
                                {activeTab === 'dashboards' && renderDashboards()}
                                {activeTab === 'custom' && (
                                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                                        <PlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                                        <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Custom Report Builder</p>
                                        <p className="text-gray-500 text-sm sm:px-4 md:px-6 lg:px-8">Coming soon - Build your own reports</p>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Widget>

            {/* Template Generation Modal */}
            {showTemplateModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Generate Report</h3>
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <h4 className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{selectedTemplate.name}</h4>
                                <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">{selectedTemplate.description}</p>
                            </div>
                            
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                <label className="block sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Week (optional)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="18"
                                        value={reportParameters.week || ''}
                                        onChange={(e: any) => setReportParameters(prev => ({ 
                                            ...prev, 
                                            week: e.target.value ? parseInt(e.target.value) : undefined 
                                        }}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white sm:px-4 md:px-6 lg:px-8"
                                        placeholder="Current week"
                                    />
                                </label>
                                
                                <label className="block sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Team (optional)</span>
                                    <input
                                        type="text"
                                        value={reportParameters.team || ''}
                                        onChange={(e: any) => setReportParameters(prev => ({ 
                                            ...prev, 
                                            team: e.target.value 
                                        }}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white sm:px-4 md:px-6 lg:px-8"
                                        placeholder="All teams"
                                    />
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-3 sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() => setShowTemplateModal(false)}
                                >
//                                     Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleGenerateReport(selectedTemplate.id, reportParameters);
                                        setShowTemplateModal(false);
                                        setReportParameters({});
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Report View Modal */}
            {showReportModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                    >
                        <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">{selectedReport.title}</h3>
                            <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <select
                                    value={exportFormat}
                                    onChange={(e: any) => setExportFormat(e.target.value as ExportFormat)}
                                >
                                    {selectedReport.exportFormats.map((format: any) => (
                                        <option key={format} value={format}>{format.toUpperCase()}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleExportReport(selectedReport.id, exportFormat)}
                                >
                                    <DownloadIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Export</span>
                                </button>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Report Data Table */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                                <table className="w-full text-sm sm:px-4 md:px-6 lg:px-8">
                                    <thead>
                                        <tr className="border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
                                            {selectedReport.data.headers.map((header: any) => (
                                                <th key={header} className="text-left p-2 text-gray-300 font-medium sm:px-4 md:px-6 lg:px-8">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedReport.data.rows.slice(0, 10).map((row, index) => (
                                            <tr key={`row-${selectedReport.id}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 sm:px-4 md:px-6 lg:px-8">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={`cell-${index}-${cellIndex}`} className="p-2 text-gray-300 sm:px-4 md:px-6 lg:px-8">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {selectedReport.data.rows.length > 10 && (
                                <div className="text-center mt-4 text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
                                    Showing first 10 of {selectedReport.data.rows.length} rows
                                </div>
                            )}
                        </div>

                        {/* Insights */}
                        {selectedReport.insights.length > 0 && (
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">Key Insights</h4>
                                {selectedReport.insights.map((insight: any) => (
                                    <div
                                        key={insight.id}
                                        className={`rounded-lg p-3 text-sm ${getInsightSeverityColor(insight.severity)}`}
                                    >
                                        <div className="font-medium mb-1 sm:px-4 md:px-6 lg:px-8">{insight.title}</div>
                                        <div className="mb-2 sm:px-4 md:px-6 lg:px-8">{insight.description}</div>
                                        {insight.recommendations && (
                                            <ul className="text-xs space-y-1 sm:px-4 md:px-6 lg:px-8">
                                                {insight.recommendations.map((rec: string, index: number) => (
                                                    <li key={`modal-rec-${insight.id}-${index}`}>• {rec}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const AdvancedReportingInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AdvancedReportingInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(AdvancedReportingInterfaceWithErrorBoundary);
