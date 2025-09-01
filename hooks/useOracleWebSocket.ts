/**
 * Custom hook for Oracle WebSocket connection management
 * Handles connection, reconnection, message routing, and status tracking
 */

import { useRef, useCallback, useEffect, useState } from &apos;react&apos;;

export interface OracleWebSocketMessage {
}
    type: string;
    [key: string]: any;
}

export interface OracleWebSocketConfig {
}
    userId: string;
    week: number;
    onMessage: (data: OracleWebSocketMessage) => void;
    onError?: (error: string) => void;
    reconnectDelay?: number;
}

export type ConnectionStatus = &apos;connected&apos; | &apos;disconnected&apos; | &apos;connecting&apos;;

export interface UseOracleWebSocketReturn {
}
    connectionStatus: ConnectionStatus;
    sendMessage: (message: OracleWebSocketMessage) => void;
    reconnect: () => void;
    disconnect: () => void;
}

export const useOracleWebSocket = ({
}
    userId,
    week,
    onMessage,
    onError,
    reconnectDelay = 3000
}: OracleWebSocketConfig): UseOracleWebSocketReturn => {
}
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(&apos;disconnected&apos;);
    const wsRef = useRef<WebSocket | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    // Send message to WebSocket
    const sendMessage = useCallback((message: OracleWebSocketMessage) => {
}
        if (wsRef.current?.readyState === WebSocket.OPEN) {
}
            try {
}

                wsRef.current.send(JSON.stringify(message));

    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
                console.error(&apos;Failed to send WebSocket message:&apos;, error);
                onError?.(&apos;Failed to send message&apos;);
            }
        } else {
}
            console.warn(&apos;WebSocket not connected, message not sent:&apos;, message);
            onError?.(&apos;WebSocket not connected&apos;);
        }
    }, [onError]);

    // Initialize WebSocket connection
    const connect = useCallback(() => {
}
        if (!userId || !mountedRef.current) return;

        // Clear any existing retry timeout
        if (retryTimeoutRef.current) {
}
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        // Close existing connection
        if (wsRef.current) {
}
            wsRef.current.close();
        }

        setConnectionStatus(&apos;connecting&apos;);
        
        try {
}
            const wsUrl = `ws://localhost:8766?userId=${userId}&week=${week}`;
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
}
                if (!mountedRef.current) return;
                
                console.log(&apos;✅ Oracle WebSocket connected&apos;);
                setConnectionStatus(&apos;connected&apos;);
                
                // Send initial subscription
                sendMessage({
}
                    type: &apos;SUBSCRIBE_PREDICTIONS&apos;,
                    week,
//                     userId
                });
            };

            wsRef.current.onmessage = (event: any) => {
}
                if (!mountedRef.current) return;
                
                try {
}

                    const data = JSON.parse(event.data);
                    onMessage(data);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
                    console.error(&apos;Failed to parse WebSocket message:&apos;, err);
                    onError?.(&apos;Failed to parse message&apos;);
                }
            };

            wsRef.current.onclose = (event: any) => {
}
                if (!mountedRef.current) return;
                
                console.log(&apos;🔌 Oracle WebSocket disconnected&apos;, event.code, event.reason);
                setConnectionStatus(&apos;disconnected&apos;);
                
                // Auto-reconnect unless it was a clean close
                if (event.code !== 1000 && mountedRef.current) {
}
                    retryTimeoutRef.current = setTimeout(() => {
}
                        if (mountedRef.current) {
}
                            connect();
                        }
                    }, reconnectDelay);
                }
            };

            wsRef.current.onerror = (error: any) => {
}
                if (!mountedRef.current) return;
                
                console.error(&apos;Oracle WebSocket error:&apos;, error);
                setConnectionStatus(&apos;disconnected&apos;);
                onError?.(&apos;WebSocket connection failed&apos;);
            };
        
    } catch (err) {
}
            if (!mountedRef.current) return;
            
            console.error(&apos;Failed to initialize WebSocket:&apos;, err);
            setConnectionStatus(&apos;disconnected&apos;);
            onError?.(&apos;Failed to establish real-time connection&apos;);
        }
    }, [userId, week, onMessage, onError, reconnectDelay, sendMessage]);

    // Manual reconnect
    const reconnect = useCallback(() => {
}
        connect();
    }, [connect]);

    // Manual disconnect
    const disconnect = useCallback(() => {
}
        mountedRef.current = false;
        
        if (retryTimeoutRef.current) {
}
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        
        if (wsRef.current) {
}
            wsRef.current.close(1000, &apos;Manual disconnect&apos;);
            wsRef.current = null;
        }
        
        setConnectionStatus(&apos;disconnected&apos;);
    }, []);

    // Initialize connection on mount
    useEffect(() => {
}
        mountedRef.current = true;
        connect();

        return () => {
}
            mountedRef.current = false;
            
            if (retryTimeoutRef.current) {
}
                clearTimeout(retryTimeoutRef.current);
            }
            
            if (wsRef.current) {
}
                wsRef.current.close(1000, &apos;Component unmounting&apos;);
            }
        };
    }, [connect]);

    // Reconnect when userId or week changes
    useEffect(() => {
}
        if (connectionStatus !== &apos;disconnected&apos;) {
}
            reconnect();
        }
    }, [userId, week, reconnect, connectionStatus]);

    return {
}
        connectionStatus,
        sendMessage,
        reconnect,
//         disconnect
    };
};
