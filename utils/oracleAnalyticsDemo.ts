/**
 * Demo script to populate Oracle Analytics with sample data
 * This can be used to demonstrate the analytics dashboard functionality
 */

export const populateSampleAnalyticsData = () => {
}
    // Sample Oracle predictions data
    const samplePredictions = [
        {
}
            id: &apos;pred-week1-1&apos;,
            week: 1,
            type: &apos;PLAYER_PERFORMANCE&apos;,
            question: &apos;Who will score the most fantasy points?&apos;,
            oracleChoice: 1,
            confidence: 85,
            actualResult: 1,
            isCorrect: true,
            recordedAt: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;pred-week1-2&apos;,
            week: 1,
            type: &apos;GAME_OUTCOME&apos;,
            question: &apos;Which team will win Chiefs vs Bills?&apos;,
            oracleChoice: 0,
            confidence: 72,
            actualResult: 1,
            isCorrect: false,
            recordedAt: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;pred-week1-3&apos;,
            week: 1,
            type: &apos;WEEKLY_SCORING&apos;,
            question: &apos;Will any player score over 30 points?&apos;,
            oracleChoice: 1,
            confidence: 68,
            actualResult: 1,
            isCorrect: true,
            recordedAt: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;pred-week2-1&apos;,
            week: 2,
            type: &apos;PLAYER_PERFORMANCE&apos;,
            question: &apos;Who will have the most rushing yards?&apos;,
            oracleChoice: 2,
            confidence: 91,
            actualResult: 2,
            isCorrect: true,
            recordedAt: new Date(&apos;2025-01-22&apos;).toISOString()
        },
        {
}
            id: &apos;pred-week2-2&apos;,
            week: 2,
            type: &apos;GAME_OUTCOME&apos;,
            question: &apos;Which game will have the highest score?&apos;,
            oracleChoice: 1,
            confidence: 76,
            actualResult: 1,
            isCorrect: true,
            recordedAt: new Date(&apos;2025-01-22&apos;).toISOString()
        },
        {
}
            id: &apos;pred-week2-3&apos;,
            week: 2,
            type: &apos;WEATHER_IMPACT&apos;,
            question: &apos;Will weather affect scoring in outdoor games?&apos;,
            oracleChoice: 0,
            confidence: 63,
            actualResult: 1,
            isCorrect: false,
            recordedAt: new Date(&apos;2025-01-22&apos;).toISOString()
        }
    ];

    // Sample user challenges data
    const sampleUserChallenges = [
        {
}
            id: &apos;challenge-week1-1&apos;,
            week: 1,
            type: &apos;PLAYER_PERFORMANCE&apos;,
            userPrediction: 1,
            actualResult: 1,
            userCorrect: true,
            points: 45,
            timestamp: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;challenge-week1-2&apos;,
            week: 1,
            type: &apos;GAME_OUTCOME&apos;,
            userPrediction: 1,
            actualResult: 1,
            userCorrect: true,
            points: 35,
            timestamp: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;challenge-week1-3&apos;,
            week: 1,
            type: &apos;WEEKLY_SCORING&apos;,
            userPrediction: 0,
            actualResult: 1,
            userCorrect: false,
            points: 0,
            timestamp: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;challenge-week2-1&apos;,
            week: 2,
            type: &apos;PLAYER_PERFORMANCE&apos;,
            userPrediction: 2,
            actualResult: 2,
            userCorrect: true,
            points: 50,
            timestamp: new Date(&apos;2025-01-22&apos;).toISOString()
        },
        {
}
            id: &apos;challenge-week2-2&apos;,
            week: 2,
            type: &apos;GAME_OUTCOME&apos;,
            userPrediction: 0,
            actualResult: 1,
            userCorrect: false,
            points: 0,
            timestamp: new Date(&apos;2025-01-22&apos;).toISOString()
        }
    ];

    // Store sample data in localStorage
    localStorage.setItem(&apos;oraclePredictions&apos;, JSON.stringify(samplePredictions));
    localStorage.setItem(&apos;userChallenges&apos;, JSON.stringify(sampleUserChallenges));

    console.log(&apos;✅ Sample Oracle analytics data populated!&apos;);
    console.log(&apos;🎯 Oracle Accuracy: 66.7% (4/6 predictions correct)&apos;);
    console.log(&apos;👤 User Win Rate: 60% (3/5 challenges won)&apos;);
    console.log(&apos;📊 Analytics Dashboard now has data to display&apos;);
    
    return {
}
        predictions: samplePredictions,
        userChallenges: sampleUserChallenges,
        summary: {
}
            oracleAccuracy: 66.7,
            userWinRate: 60,
            totalPredictions: 6,
            totalChallenges: 5
        }
    };
};

// Function to clear sample data
export const clearSampleData = () => {
}
    localStorage.removeItem(&apos;oraclePredictions&apos;);
    localStorage.removeItem(&apos;userChallenges&apos;);
    console.log(&apos;🧹 Sample data cleared&apos;);
};

// Function to check if sample data exists
export const hasSampleData = (): boolean => {
}
    const predictions = localStorage.getItem(&apos;oraclePredictions&apos;);
    const challenges = localStorage.getItem(&apos;userChallenges&apos;);
    return !!(predictions && challenges);
};

console.log(&apos;📊 Oracle Analytics Demo Utils Loaded&apos;);
console.log(&apos;💡 Use populateSampleAnalyticsData() to add demo data&apos;);
console.log(&apos;🧹 Use clearSampleData() to remove demo data&apos;);
console.log(&apos;❓ Use hasSampleData() to check if demo data exists&apos;);
