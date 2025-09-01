/**
 * Demo script to populate Oracle Rewards with sample data
 * This can be used to demonstrate the rewards system functionality
 */

import { oracleRewardsService } from &apos;../services/oracleRewardsService&apos;;

export const populateSampleRewardsData = async () => {
}
    // Sample rewards data
    const sampleRewards = {
}
        totalPoints: 2450,
        weeklyPoints: 340,
        seasonalPoints: 2450,
        level: 5,
        nextLevelPoints: 50,
        achievements: [],
        badges: [],
        availableTitles: [&apos;Oracle Challenger&apos;, &apos;Streak Master&apos;],
        activeTitle: &apos;Oracle Challenger&apos;,
        streakMultiplier: 1.3,
        seasonRank: 12,
        weeklyRank: 8
    };

    // Sample unlocked achievements
    const sampleAchievements = [
        {
}
            id: &apos;first-win&apos;,
            title: &apos;First Victory&apos;,
            description: &apos;Win your first Oracle challenge&apos;,
            icon: &apos;🎯&apos;,
            category: &apos;PREDICTION&apos;,
            difficulty: &apos;BRONZE&apos;,
            requirements: { type: &apos;WIN_COUNT&apos;, target: 1 },
            points: 50,
            unlockedAt: new Date(&apos;2025-01-10&apos;).toISOString()
        },
        {
}
            id: &apos;ten-wins&apos;,
            title: &apos;Oracle Challenger&apos;,
            description: &apos;Win 10 Oracle challenges&apos;,
            icon: &apos;⚔️&apos;,
            category: &apos;PREDICTION&apos;,
            difficulty: &apos;SILVER&apos;,
            requirements: { type: &apos;WIN_COUNT&apos;, target: 10 },
            points: 200,
            unlockedAt: new Date(&apos;2025-01-18&apos;).toISOString()
        },
        {
}
            id: &apos;three-streak&apos;,
            title: &apos;Hot Streak&apos;,
            description: &apos;Win 3 challenges in a row&apos;,
            icon: &apos;🔥&apos;,
            category: &apos;STREAK&apos;,
            difficulty: &apos;BRONZE&apos;,
            requirements: { type: &apos;STREAK&apos;, target: 3 },
            points: 100,
            unlockedAt: new Date(&apos;2025-01-15&apos;).toISOString()
        },
        {
}
            id: &apos;five-streak&apos;,
            title: &apos;On Fire&apos;,
            description: &apos;Win 5 challenges in a row&apos;,
            icon: &apos;🌟&apos;,
            category: &apos;STREAK&apos;,
            difficulty: &apos;SILVER&apos;,
            requirements: { type: &apos;STREAK&apos;, target: 5 },
            points: 250,
            unlockedAt: new Date(&apos;2025-01-20&apos;).toISOString()
        },
        {
}
            id: &apos;point-collector&apos;,
            title: &apos;Point Collector&apos;,
            description: &apos;Earn 1,000 total points&apos;,
            icon: &apos;💰&apos;,
            category: &apos;MILESTONE&apos;,
            difficulty: &apos;SILVER&apos;,
            requirements: { type: &apos;POINTS_TOTAL&apos;, target: 1000 },
            points: 200,
            unlockedAt: new Date(&apos;2025-01-25&apos;).toISOString()
        }
    ];

    // Sample badges
    const sampleBadges = [
        {
}
            id: &apos;rookie&apos;,
            name: &apos;Rookie&apos;,
            description: &apos;Complete your first challenge&apos;,
            icon: &apos;🆕&apos;,
            color: &apos;bg-green-500&apos;,
            rarity: &apos;COMMON&apos;,
            earnedAt: new Date(&apos;2025-01-10&apos;).toISOString()
        },
        {
}
            id: &apos;veteran&apos;,
            name: &apos;Veteran&apos;,
            description: &apos;Complete 50 challenges&apos;,
            icon: &apos;⭐&apos;,
            color: &apos;bg-blue-500&apos;,
            rarity: &apos;RARE&apos;,
            earnedAt: new Date(&apos;2025-01-28&apos;).toISOString()
        },
        {
}
            id: &apos;oracle-nemesis&apos;,
            name: &apos;Oracle Nemesis&apos;,
            description: &apos;Beat Oracle 10 times in high-confidence predictions&apos;,
            icon: &apos;⚔️&apos;,
            color: &apos;bg-red-500&apos;,
            rarity: &apos;EPIC&apos;,
            earnedAt: new Date(&apos;2025-02-01&apos;).toISOString()
        }
    ];

    // Store sample data in localStorage
    localStorage.setItem(&apos;oracleRewards&apos;, JSON.stringify(sampleRewards));
    localStorage.setItem(&apos;oracleAchievements&apos;, JSON.stringify(sampleAchievements));
    localStorage.setItem(&apos;oracleBadges&apos;, JSON.stringify(sampleBadges));

    console.log(&apos;✅ Sample Oracle rewards data populated!&apos;);
    console.log(&apos;🏆 Level 5 with 2,450 total points&apos;);
    console.log(&apos;🎯 5 achievements unlocked&apos;);
    console.log(&apos;🏅 3 badges earned&apos;);
    console.log(&apos;🔥 1.3x streak multiplier active&apos;);
    console.log(&apos;📊 Rewards Dashboard now has data to display&apos;);
    
    return {
}
        rewards: sampleRewards,
        achievements: sampleAchievements,
        badges: sampleBadges,
        summary: {
}
            level: 5,
            totalPoints: 2450,
            achievementsCount: 5,
            badgesCount: 3,
            weeklyRank: 8,
            seasonRank: 12
        }
    };
};

// Function to clear sample rewards data
export const clearSampleRewardsData = () => {
}
    localStorage.removeItem(&apos;oracleRewards&apos;);
    localStorage.removeItem(&apos;oracleAchievements&apos;);
    localStorage.removeItem(&apos;oracleBadges&apos;);
    console.log(&apos;🧹 Sample rewards data cleared&apos;);
};

// Function to check if sample rewards data exists
export const hasSampleRewardsData = (): boolean => {
}
    const rewards = localStorage.getItem(&apos;oracleRewards&apos;);
    const achievements = localStorage.getItem(&apos;oracleAchievements&apos;);
    const badges = localStorage.getItem(&apos;oracleBadges&apos;);
    return !!(rewards && achievements && badges);
};

// Function to simulate earning a reward
export const simulateRewardEarning = async (challengeType = &apos;PLAYER_PERFORMANCE&apos;) => {
}
    try {
}
        const rewardCalc = await oracleRewardsService.calculateChallengeReward(
            true,  // isWin
            85,    // oracleConfidence
            3,     // currentStreak
            challengeType,
            true   // beatOracle
        );

        await oracleRewardsService.applyRewards(rewardCalc);
        
        console.log(&apos;🎉 Simulated reward earning:&apos;);
        console.log(`💰 ${rewardCalc.totalPoints} total points`);
        console.log(`🔥 ${rewardCalc.streakBonus} streak bonus`);
        console.log(`🎯 ${rewardCalc.accuracyBonus} Oracle beaten bonus`);
        
        if (rewardCalc.newAchievements.length > 0) {
}
            console.log(`🏆 ${rewardCalc.newAchievements.length} new achievements`);
        }
        
        if (rewardCalc.levelUp) {
}
            console.log(&apos;⬆️ Level up!&apos;);
        }
        
        return rewardCalc;
    
    } catch (error) {
}
        console.error(&apos;Failed to simulate reward earning:&apos;, error);
        return null;
    }
};

console.log(&apos;🎮 Oracle Rewards Demo Utils Loaded&apos;);
console.log(&apos;💡 Use populateSampleRewardsData() to add demo data&apos;);
console.log(&apos;🧹 Use clearSampleRewardsData() to remove demo data&apos;);
console.log(&apos;❓ Use hasSampleRewardsData() to check if demo data exists&apos;);
console.log(&apos;🎉 Use simulateRewardEarning() to test reward notifications&apos;);
