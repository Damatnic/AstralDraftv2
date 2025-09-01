/**
 * Injury Dashboard Component
 * Comprehensive injury monitoring dashboard with real-time alerts and management tools
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect, useCallback } from &apos;react&apos;;
import { Card, CardContent, CardHeader, CardTitle } from &apos;../ui/Card&apos;;
import { Badge } from &apos;../ui/Badge&apos;;
import { Tabs } from &apos;../ui/Tabs&apos;;
import {
}
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Bell,
  Settings,
  Plus,
  X,
  Heart,
  AlertCircle,
  CheckCircle,
  Calendar,
  BarChart3,
//   Search
} from &apos;lucide-react&apos;;
import {
}
  injuryTrackingService,
  InjuryDashboardData,
  InjuryAlert,
//   MonitoredPlayer
} from &apos;../../services/injuryTrackingService&apos;;

interface InjuryDashboardProps {
}
  className?: string;

}

interface PlayerSearchResult {
}
  playerId: string;
  name: string;
  position: string;
  team: string;
  currentInjuryStatus?: string;}

const InjuryDashboard: React.FC<InjuryDashboardProps> = ({ className = &apos;&apos;  }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [dashboardData, setDashboardData] = useState<InjuryDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState(&apos;overview&apos;);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<InjuryAlert[]>([]);
  const [monitoredPlayers, setMonitoredPlayers] = useState<MonitoredPlayer[]>([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(&apos;&apos;);
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);

  useEffect(() => {
}
    loadDashboardData();
    setupSubscriptions();
    injuryTrackingService.startMonitoring();

    return () => {
}
      injuryTrackingService.stopMonitoring();
    };
  }, []);

  const loadDashboardData = async () => {
}
    try {
}

      setLoading(true);
      const data = await injuryTrackingService.getInjuryDashboard();
      setDashboardData(data);
      setMonitoredPlayers(injuryTrackingService.getMonitoredPlayers());
    
    } catch (error) {
}
    } finally {
}
      setLoading(false);

  };

  const setupSubscriptions = () => {
}
    injuryTrackingService.onInjuryAlert((alert: any) => {
}
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    });

    injuryTrackingService.onInjuryStatusUpdate(() => {
}
      loadDashboardData(); // Refresh dashboard on updates
    });
  };

  const handleAddPlayer = (playerId: string, playerName: string, position: string) => {
}
    injuryTrackingService.addMonitoredPlayer(
      playerId,
      playerName,
      {}, // Default preferences
      &apos;MEDIUM&apos;,
      [&apos;WATCHLIST&apos;]
    );
    setMonitoredPlayers(injuryTrackingService.getMonitoredPlayers());
    setShowAddPlayer(false);
    setSearchQuery(&apos;&apos;);
    setSearchResults([]);
  };

  const handleRemovePlayer = (playerId: string) => {
}
    injuryTrackingService.removeMonitoredPlayer(playerId);
    setMonitoredPlayers(injuryTrackingService.getMonitoredPlayers());
  };

  const handlePlayerSearch = useCallback(async (query: string) => {
}
    if (query.length < 2) {
}
      setSearchResults([]);
      return;

    // Mock search results - in production, would search player database
    const mockResults: PlayerSearchResult[] = [
      { playerId: &apos;search_1&apos;, name: &apos;Test Player 1&apos;, position: &apos;RB&apos;, team: &apos;TB&apos; },
      { playerId: &apos;search_2&apos;, name: &apos;Test Player 2&apos;, position: &apos;WR&apos;, team: &apos;KC&apos; },
      { playerId: &apos;search_3&apos;, name: &apos;Test Player 3&apos;, position: &apos;QB&apos;, team: &apos;BUF&apos; }
    ].filter((player: any) => 
      player.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
  }, []);

  const getInjuryStatusIcon = (status: string) => {
}
    switch (status) {
}
      case &apos;healthy&apos;: return <CheckCircle className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;questionable&apos;: return <AlertCircle className="h-4 w-4 text-yellow-600 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;doubtful&apos;: return <AlertTriangle className="h-4 w-4 text-orange-600 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;out&apos;: return <X className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Activity className="h-4 w-4 text-gray-600 sm:px-4 md:px-6 lg:px-8" />;

  };

  const getInjuryStatusBadgeVariant = (status: string) => {
}
    switch (status) {
}
      case &apos;healthy&apos;: return &apos;default&apos;;
      case &apos;questionable&apos;: return &apos;secondary&apos;;
      case &apos;doubtful&apos;: return &apos;destructive&apos;;
      case &apos;out&apos;: return &apos;destructive&apos;;
      default: return &apos;outline&apos;;

  };

  const getSeverityColor = (severity: string) => {
}
    switch (severity) {
}
      case &apos;LOW&apos;: return &apos;text-green-600&apos;;
      case &apos;MEDIUM&apos;: return &apos;text-yellow-600&apos;;
      case &apos;HIGH&apos;: return &apos;text-orange-600&apos;;
      case &apos;CRITICAL&apos;: return &apos;text-red-600&apos;;
      default: return &apos;text-gray-600&apos;;

  };

  const getSeverityBorderColor = (severity: string) => {
}
    switch (severity) {
}
      case &apos;CRITICAL&apos;: return &apos;border-l-red-500&apos;;
      case &apos;HIGH&apos;: return &apos;border-l-orange-500&apos;;
      case &apos;MEDIUM&apos;: return &apos;border-l-yellow-500&apos;;
      default: return &apos;border-l-green-500&apos;;

  };

  const getTrendBadgeVariant = (trend: string) => {
}
    switch (trend) {
}
      case &apos;INCREASING&apos;: return &apos;destructive&apos;;
      case &apos;DECREASING&apos;: return &apos;default&apos;;
      default: return &apos;secondary&apos;;

  };

  const formatTimeAgo = (timestamp: string) => {
}
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return &apos;Just now&apos;;
  };

  if (loading) {
}
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Heart className="h-5 w-5 animate-pulse text-red-500 sm:px-4 md:px-6 lg:px-8" />
            Loading Injury Dashboard...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
          </div>
        </CardContent>
      </Card>
    );

  if (!dashboardData) {
}
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-600 sm:px-4 md:px-6 lg:px-8">Error Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Failed to load injury dashboard data</p>
        </CardContent>
      </Card>
    );

  return (
    <div className={`injury-dashboard ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <Heart className="h-5 w-5 text-red-500 sm:px-4 md:px-6 lg:px-8" />
              Injury Tracking Dashboard
            </div>
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <Badge variant="outline" className="bg-blue-50 sm:px-4 md:px-6 lg:px-8">
                {dashboardData.totalMonitoredPlayers} monitored
              </Badge>
              {dashboardData.activeInjuries > 0 && (
}
                <Badge variant="error">
                  {dashboardData.activeInjuries} injured
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Monitored Players</p>
                    <p className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8">{dashboardData.totalMonitoredPlayers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Active Injuries</p>
                    <p className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8">{dashboardData.activeInjuries}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600 sm:px-4 md:px-6 lg:px-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Recent Alerts</p>
                    <p className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8">{alerts.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-yellow-600 sm:px-4 md:px-6 lg:px-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Fantasy Impact</p>
                    <p className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8">{dashboardData.weeklyImpact.fantasyPointsLost.toFixed(0)}</p>
                    <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">pts lost</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600 sm:px-4 md:px-6 lg:px-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs>
            items={[
}
              { id: &apos;overview&apos;, label: &apos;Overview&apos; },
              { id: &apos;monitored&apos;, label: &apos;Monitored Players&apos; },
              { id: &apos;alerts&apos;, label: &apos;Alerts&apos; },
              { id: &apos;trends&apos;, label: &apos;Trends&apos; }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6 sm:px-4 md:px-6 lg:px-8">
            {activeTab === &apos;overview&apos; && (
}
              <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                {/* Critical Updates */}
                {dashboardData.criticalUpdates.length > 0 && (
}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600 sm:px-4 md:px-6 lg:px-8">
                        <AlertTriangle className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                        Critical Injury Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {dashboardData.criticalUpdates.map((injury: any) => (
}
                          <div key={injury.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                              {getInjuryStatusIcon(injury?.status)}
                              <div>
                                <p className="font-medium sm:px-4 md:px-6 lg:px-8">{injury.playerName}</p>
                                <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{injury.team} • {injury.position} • {injury?.injuryType}</p>
                              </div>
                            </div>
                            <div className="text-right sm:px-4 md:px-6 lg:px-8">
                              <Badge variant={getInjuryStatusBadgeVariant(injury?.status)}>
                                {injury?.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">{formatTimeAgo(injury.lastUpdated)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Replacement Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <Target className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                      Recommended Replacements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      {dashboardData.replacementRecommendations.map((player: any) => (
}
                        <div key={player.playerId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 sm:px-4 md:px-6 lg:px-8">
                          <div>
                            <p className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                            <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{player.team} • {player.position}</p>
                          </div>
                          <div className="text-right sm:px-4 md:px-6 lg:px-8">
                            <p className="font-medium sm:px-4 md:px-6 lg:px-8">{player.projectedPoints.toFixed(1)} pts</p>
                            <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{player.availabilityPercentage}% available</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <Calendar className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                      Week {dashboardData.weeklyImpact.week} Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(dashboardData.weeklyImpact.positionBreakdown).map(([position, count]) => (
}
                        <div key={position} className="text-center p-3 bg-gray-50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <p className="text-lg font-bold sm:px-4 md:px-6 lg:px-8">{count.toFixed(0)}</p>
                          <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{position} affected</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === &apos;monitored&apos; && (
}
              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <h3 className="text-lg font-semibold sm:px-4 md:px-6 lg:px-8">Monitored Players ({monitoredPlayers.length})</h3>
                  <button
                    onClick={() => setShowAddPlayer(true)}
                  >
                    <Plus className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                    Add Player
                  </button>
                </div>

                {/* Add Player Modal */}
                {showAddPlayer && (
}
                  <Card className="border-blue-200 bg-blue-50 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <Search className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                          Add Player to Monitor
                        </div>
                        <button
                          onClick={() => setShowAddPlayer(false)}
                        >
                          <X className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <input
                          type="text"
                          placeholder="Search for players..."
                          value={searchQuery}
                          onChange={(e: any) => {
}
                            setSearchQuery(e.target.value);
                            handlePlayerSearch(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                        />
                        
                        {searchResults.length > 0 && (
}
                          <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            {searchResults.map((player: any) => (
}
                              <button
                                key={player.playerId}
                                type="button"
                                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 text-left sm:px-4 md:px-6 lg:px-8"
                                onClick={() => handleAddPlayer(player.playerId, player.name, player.position)}
                                <div>
                                  <p className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                                  <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{player.team} • {player.position}</p>
                                </div>
                                <Plus className="h-4 w-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Monitored Players List */}
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  {monitoredPlayers.map((player: any) => {
}
                    const status = injuryTrackingService.getPlayerInjuryStatus(player.playerId);
                    return (
                      <Card key={player.playerId}>
                        <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                              {status && getInjuryStatusIcon(status?.status)}
                              <div>
                                <p className="font-medium sm:px-4 md:px-6 lg:px-8">{player.playerName}</p>
                                <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
                                  Priority: {player.priority} • Added: {new Date(player.addedAt).toLocaleDateString()}
                                </p>
                                {status && (
}
                                  <p className="text-sm sm:px-4 md:px-6 lg:px-8">
                                    Status: <Badge variant={getInjuryStatusBadgeVariant(status?.status)}>
                                      {status?.status}
                                    </Badge>
                                    {status?.injuryType !== &apos;None&apos; && (
}
                                      <span className="ml-2 text-gray-600 sm:px-4 md:px-6 lg:px-8">({status?.injuryType})</span>
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                              <button
                                type="button"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded sm:px-4 md:px-6 lg:px-8"
                               aria-label="Action button">
                                <Settings className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                              </button>
                              <button
                                onClick={() => handleRemovePlayer(player.playerId)}
                              >
                                <X className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {monitoredPlayers.length === 0 && (
}
                  <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                    <p className="text-gray-600 mb-4 sm:px-4 md:px-6 lg:px-8">No players being monitored</p>
                    <button
                      onClick={() => setShowAddPlayer(true)}
                    >
                      Add Your First Player
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === &apos;alerts&apos; && (
}
              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold sm:px-4 md:px-6 lg:px-8">Recent Alerts</h3>
                
                {alerts.length > 0 ? (
}
                  <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {alerts.map((alert: any) => {
}
                      const borderColor = getSeverityBorderColor(alert.severity);
                      return (
                        <Card key={alert.id} className={`border-l-4 ${borderColor}`}>
                          <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                              <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                                  <span className={`font-medium ${getSeverityColor(alert.severity)}`}>
                                    {alert.alertType.replace(&apos;_&apos;, &apos; &apos;)}
                                  </span>
                                  <Badge variant="outline">{alert.severity}</Badge>
                                </div>
                                <p className="font-medium mb-1 sm:px-4 md:px-6 lg:px-8">{alert.message}</p>
                                <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{alert.team}</p>
                                
                                {alert.fantasyActions.length > 0 && (
}
                                  <div className="mt-3 sm:px-4 md:px-6 lg:px-8">
                                    <p className="text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">Recommended Actions:</p>
                                    <ul className="text-sm text-gray-600 space-y-1 sm:px-4 md:px-6 lg:px-8">
                                      {alert.fantasyActions.map((action: any) => (
}
                                        <li key={action} className="flex items-start gap-2 sm:px-4 md:px-6 lg:px-8">
                                          <span className="text-blue-600 sm:px-4 md:px-6 lg:px-8">•</span>
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="text-right text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                <p>{formatTimeAgo(alert.timestamp)}</p>
                                {alert.actionRequired && (
}
                                  <Badge variant="error" className="mt-1 sm:px-4 md:px-6 lg:px-8">Action Required</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                    <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">No recent alerts</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === &apos;trends&apos; && (
}
              <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <BarChart3 className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                      Injury Trends by Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                      {dashboardData?.injuryTrends.map((trend: any) => {
}
                        const badgeVariant = getTrendBadgeVariant(trend.trend);
                        return (
                          <div key={trend.position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                              <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                {trend.trend === &apos;INCREASING&apos; && <TrendingUp className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />}
                                {trend.trend === &apos;DECREASING&apos; && <TrendingDown className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />}
                                {trend.trend === &apos;STABLE&apos; && <Activity className="h-4 w-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />}
                                <span className="font-medium sm:px-4 md:px-6 lg:px-8">{trend.position}</span>
                              </div>
                              <Badge variant={badgeVariant}>
                                {trend.trend}
                              </Badge>
                            </div>
                            <div className="text-right sm:px-4 md:px-6 lg:px-8">
                              <p className="font-medium sm:px-4 md:px-6 lg:px-8">{trend.seasonTotal} total</p>
                              <p className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{trend.averageRecoveryTime}d avg recovery</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InjuryDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <InjuryDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(InjuryDashboardWithErrorBoundary);
