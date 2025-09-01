/**
 * Celebrity Draft Personas Service
 * AI-powered draft strategies mimicking celebrity approaches
 */

import { Player, PlayerPosition } from &apos;../types&apos;;

export interface CelebrityPersona {
}
  id: string;
  name: string;
  avatar?: string;
  description: string;
  draftPhilosophy: string;
  strategies: {
}
    positionPreference: PlayerPosition[];
    playerTraits: string[];
    riskTolerance: &apos;conservative&apos; | &apos;moderate&apos; | &apos;aggressive&apos;;
    valuationFactors: {
}
      factor: string;
      weight: number;
    }[];
  };
  catchPhrases: string[];
  draftTips: string[];
}

export const CELEBRITY_PERSONAS: CelebrityPersona[] = [
  {
}
    id: &apos;tom-brady&apos;,
    name: &apos;Tom Brady&apos;,
    description: &apos;The GOAT - Values proven winners and championship experience&apos;,
    draftPhilosophy: &apos;Championships are won with smart, clutch players who perform when it matters most&apos;,
    strategies: {
}
      positionPreference: [&apos;QB&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;RB&apos;],
      playerTraits: [&apos;proven-veteran&apos;, &apos;clutch-performer&apos;, &apos;high-football-iq&apos;, &apos;leadership&apos;, &apos;playoff-experience&apos;],
      riskTolerance: &apos;conservative&apos;,
      valuationFactors: [
        { factor: &apos;championship_experience&apos;, weight: 0.25 },
        { factor: &apos;consistency&apos;, weight: 0.30 },
        { factor: &apos;veteran_presence&apos;, weight: 0.20 },
        { factor: &apos;system_fit&apos;, weight: 0.15 },
        { factor: &apos;injury_history&apos;, weight: -0.10 }
      ]
    },
    catchPhrases: [
      "This guy&apos;s a winner - reminds me of my Super Bowl teams",
      "You need players who show up in December",
      "Leadership matters as much as talent",
      "I&apos;d take this guy to war with me"
    ],
    draftTips: [
      "Never undervalue experience in crucial situations",
      "Target players from winning organizations",
      "Prioritize consistency over boom/bust potential",
      "Build around a strong QB-WR connection"
    ]
  },
  {
}
    id: &apos;peyton-manning&apos;,
    name: &apos;Peyton Manning&apos;,
    description: &apos;The Cerebral One - Analytics-heavy, loves high-IQ players&apos;,
    draftPhilosophy: &apos;Study the numbers, understand the matchups, and always be three moves ahead&apos;,
    strategies: {
}
      positionPreference: [&apos;QB&apos;, &apos;WR&apos;, &apos;RB&apos;, &apos;TE&apos;],
      playerTraits: [&apos;high-target-share&apos;, &apos;route-running&apos;, &apos;pass-catching-rb&apos;, &apos;efficient&apos;, &apos;smart&apos;],
      riskTolerance: &apos;moderate&apos;,
      valuationFactors: [
        { factor: &apos;yards_after_catch&apos;, weight: 0.20 },
        { factor: &apos;target_share&apos;, weight: 0.25 },
        { factor: &apos;red_zone_usage&apos;, weight: 0.20 },
        { factor: &apos;offensive_system&apos;, weight: 0.25 },
        { factor: &apos;quarterback_quality&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "The analytics love this pick - 87.3% success rate",
      "Omaha! This player fits perfectly in their system",
      "Look at those third-down conversion rates",
      "His DVOA is off the charts"
    ],
    draftTips: [
      "Focus on players in high-volume passing offenses",
      "Target share is more predictive than total yards",
      "Red zone opportunities win championships",
      "Stack QB-WR combos for ceiling plays"
    ]
  },
  {
}
    id: &apos;michael-jordan&apos;,
    name: &apos;Michael Jordan&apos;,
    description: &apos;His Airness - Competitive players, clutch performers, winners&apos;,
    draftPhilosophy: &apos;I don\&apos;t draft good players, I draft killers who want to win at all costs&apos;,
    strategies: {
}
      positionPreference: [&apos;RB&apos;, &apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;],
      playerTraits: [&apos;alpha-mentality&apos;, &apos;clutch-gene&apos;, &apos;competitor&apos;, &apos;athletic-freak&apos;, &apos;winner&apos;],
      riskTolerance: &apos;aggressive&apos;,
      valuationFactors: [
        { factor: &apos;fourth_quarter_performance&apos;, weight: 0.25 },
        { factor: &apos;primetime_games&apos;, weight: 0.20 },
        { factor: &apos;athletic_score&apos;, weight: 0.20 },
        { factor: &apos;competitive_drive&apos;, weight: 0.25 },
        { factor: &apos;big_play_ability&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "This kid&apos;s got that killer instinct",
      "And I took that personally... drafting him",
      "Champions are built different",
      "He reminds me of myself - refuses to lose"
    ],
    draftTips: [
      "Draft players who elevate in big moments",
      "Athletic ability creates mismatches",
      "Mental toughness beats talent",
      "Target players with chips on their shoulders"
    ]
  },
  {
}
    id: &apos;lebron-james&apos;,
    name: &apos;LeBron James&apos;,
    description: &apos;The King - Athletic freaks, versatile players, high upside&apos;,
    draftPhilosophy: &apos;Give me athletes who can do it all - they\&apos;ll find a way to produce&apos;,
    strategies: {
}
      positionPreference: [&apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;QB&apos;],
      playerTraits: [&apos;versatile&apos;, &apos;athletic&apos;, &apos;dual-threat&apos;, &apos;yac-ability&apos;, &apos;multi-position&apos;],
      riskTolerance: &apos;moderate&apos;,
      valuationFactors: [
        { factor: &apos;athletic_measurables&apos;, weight: 0.30 },
        { factor: &apos;versatility&apos;, weight: 0.25 },
        { factor: &apos;age&apos;, weight: 0.15 },
        { factor: &apos;upside&apos;, weight: 0.20 },
        { factor: &apos;team_situation&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "This guy can play multiple positions - that&apos;s valuable",
      "Built different - look at those combine numbers",
      "He&apos;s got that next-level athleticism",
      "Young talent with room to grow - I like it"
    ],
    draftTips: [
      "Prioritize players who contribute in multiple ways",
      "Athletic testing correlates with breakout potential",
      "Target ascending players in improving offenses",
      "Don&apos;t overlook dual-threat QBs and pass-catching RBs"
    ]
  },
  {
}
    id: &apos;patrick-mahomes&apos;,
    name: &apos;Patrick Mahomes&apos;,
    description: &apos;Showtime - Young talent, explosive players, risk-takers&apos;,
    draftPhilosophy: &apos;No risk it, no biscuit - swing for the fences and create fireworks&apos;,
    strategies: {
}
      positionPreference: [&apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;, &apos;RB&apos;],
      playerTraits: [&apos;explosive&apos;, &apos;big-play&apos;, &apos;young-talent&apos;, &apos;upside&apos;, &apos;breakout-candidate&apos;],
      riskTolerance: &apos;aggressive&apos;,
      valuationFactors: [
        { factor: &apos;explosive_play_rate&apos;, weight: 0.30 },
        { factor: &apos;age_breakout_potential&apos;, weight: 0.25 },
        { factor: &apos;deep_ball_ability&apos;, weight: 0.20 },
        { factor: &apos;yards_per_touch&apos;, weight: 0.15 },
        { factor: &apos;highlight_potential&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "This guy can take it to the house any play",
      "Speed kills - and he&apos;s got jets",
      "Young hungry player ready to explode",
      "That&apos;s a league-winner right there"
    ],
    draftTips: [
      "Target second and third-year breakouts",
      "Speed and explosiveness create weekly ceiling",
      "Don&apos;t be afraid of high-risk, high-reward picks",
      "Stack explosive offenses for maximum upside"
    ]
  },
  {
}
    id: &apos;bill-belichick&apos;,
    name: &apos;Bill Belichick&apos;,
    description: &apos;The Hoodie - Value picks, system fits, depth over stars&apos;,
    draftPhilosophy: &apos;Do your job - find value where others don\&apos;t look and build sustainable depth&apos;,
    strategies: {
}
      positionPreference: [&apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;DST&apos;],
      playerTraits: [&apos;system-fit&apos;, &apos;value&apos;, &apos;consistent&apos;, &apos;situational&apos;, &apos;depth&apos;],
      riskTolerance: &apos;conservative&apos;,
      valuationFactors: [
        { factor: &apos;value_over_adp&apos;, weight: 0.35 },
        { factor: &apos;role_security&apos;, weight: 0.25 },
        { factor: &apos;system_familiarity&apos;, weight: 0.20 },
        { factor: &apos;special_teams_value&apos;, weight: 0.10 },
        { factor: &apos;injury_risk&apos;, weight: -0.10 }
      ]
    },
    catchPhrases: [
      "Great value at this spot",
      "He does his job, nothing flashy",
      "System players win games",
      "We&apos;re on to the next pick"
    ],
    draftTips: [
      "Find value in later rounds",
      "Target players with secure roles",
      "Build depth at every position",
      "Don&apos;t chase last year&apos;s stats"
    ]
  },
  {
}
    id: &apos;travis-kelce&apos;,
    name: &apos;Travis Kelce&apos;,
    description: &apos;The Showman - TE-heavy, receiving backs, pass-catchers&apos;,
    draftPhilosophy: &apos;Dominate the middle of the field with elite pass-catchers&apos;,
    strategies: {
}
      positionPreference: [&apos;TE&apos;, &apos;WR&apos;, &apos;RB&apos;, &apos;QB&apos;],
      playerTraits: [&apos;pass-catching&apos;, &apos;red-zone-target&apos;, &apos;reliable-hands&apos;, &apos;route-runner&apos;, &apos;mismatch&apos;],
      riskTolerance: &apos;moderate&apos;,
      valuationFactors: [
        { factor: &apos;targets_per_game&apos;, weight: 0.30 },
        { factor: &apos;red_zone_targets&apos;, weight: 0.25 },
        { factor: &apos;catch_rate&apos;, weight: 0.20 },
        { factor: &apos;slot_usage&apos;, weight: 0.15 },
        { factor: &apos;quarterback_rapport&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "Elite tight ends are like cheat codes",
      "Pass-catching backs are the new meta",
      "This guy&apos;s always open - trust me",
      "Red zone monster right here"
    ],
    draftTips: [
      "Premium TEs provide positional advantage",
      "Target pass-catching specialists",
      "Red zone usage equals fantasy points",
      "PPR leagues favor volume receivers"
    ]
  },
  {
}
    id: &apos;shaquille-oneal&apos;,
    name: &apos;Shaquille O\&apos;Neal&apos;,
    description: &apos;The Diesel - Big personalities, power runners, dominant players&apos;,
    draftPhilosophy: &apos;Dominate with power - give me the big dogs who punish defenses&apos;,
    strategies: {
}
      positionPreference: [&apos;RB&apos;, &apos;TE&apos;, &apos;DST&apos;, &apos;QB&apos;],
      playerTraits: [&apos;power-runner&apos;, &apos;physical&apos;, &apos;dominant&apos;, &apos;personality&apos;, &apos;intimidating&apos;],
      riskTolerance: &apos;aggressive&apos;,
      valuationFactors: [
        { factor: &apos;yards_after_contact&apos;, weight: 0.30 },
        { factor: &apos;goal_line_carries&apos;, weight: 0.25 },
        { factor: &apos;physical_dominance&apos;, weight: 0.20 },
        { factor: &apos;personality_factor&apos;, weight: 0.15 },
        { factor: &apos;broken_tackles&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "BBQ chicken! This guy dominates",
      "That&apos;s a bad man right there",
      "Power football wins championships",
      "He&apos;s got that dawg in him"
    ],
    draftTips: [
      "Physical runners wear down defenses",
      "Goal line backs score TDs",
      "Personality and swagger matter",
      "Dominate the trenches, dominate the game"
    ]
  },
  {
}
    id: &apos;charles-barkley&apos;,
    name: &apos;Charles Barkley&apos;,
    description: &apos;Sir Charles - Gut feelings, entertainment value, bold picks&apos;,
    draftPhilosophy: &apos;Trust your gut, have fun, and don\&apos;t be afraid to go against the grain&apos;,
    strategies: {
}
      positionPreference: [&apos;RB&apos;, &apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;],
      playerTraits: [&apos;entertaining&apos;, &apos;boom-bust&apos;, &apos;personality&apos;, &apos;underdog&apos;, &apos;sleeper&apos;],
      riskTolerance: &apos;aggressive&apos;,
      valuationFactors: [
        { factor: &apos;gut_feeling&apos;, weight: 0.30 },
        { factor: &apos;entertainment_value&apos;, weight: 0.20 },
        { factor: &apos;underdog_story&apos;, weight: 0.20 },
        { factor: &apos;boom_potential&apos;, weight: 0.20 },
        { factor: &apos;contrarian_value&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "That&apos;s turrible analysis - I&apos;m taking him anyway",
      "My gut says this is the pick",
      "Everybody&apos;s wrong about this guy",
      "Guaranteed league winner - Guaaaranteed!"
    ],
    draftTips: [
      "Sometimes you gotta trust your instincts",
      "Don&apos;t follow the herd mentality",
      "Bold picks win championships",
      "Have fun with it - it&apos;s just a game"
    ]
  },
  {
}
    id: &apos;stephen-curry&apos;,
    name: &apos;Stephen Curry&apos;,
    description: &apos;Chef Curry - Efficiency metrics, three-down backs, consistency&apos;,
    draftPhilosophy: &apos;Efficiency is everything - find players who maximize every opportunity&apos;,
    strategies: {
}
      positionPreference: [&apos;WR&apos;, &apos;RB&apos;, &apos;QB&apos;, &apos;TE&apos;],
      playerTraits: [&apos;efficient&apos;, &apos;consistent&apos;, &apos;three-down-back&apos;, &apos;high-floor&apos;, &apos;reliable&apos;],
      riskTolerance: &apos;moderate&apos;,
      valuationFactors: [
        { factor: &apos;yards_per_touch&apos;, weight: 0.25 },
        { factor: &apos;snap_share&apos;, weight: 0.25 },
        { factor: &apos;efficiency_metrics&apos;, weight: 0.20 },
        { factor: &apos;consistency_score&apos;, weight: 0.20 },
        { factor: &apos;opportunity_share&apos;, weight: 0.10 }
      ]
    },
    catchPhrases: [
      "Efficiency wins games - this guy delivers",
      "Three-down backs are gold in fantasy",
      "Consistency beats boom-bust every time",
      "Night night - this pick is automatic"
    ],
    draftTips: [
      "Target players with high snap counts",
      "Efficiency metrics predict success",
      "Consistent floor with upside wins leagues",
      "Opportunity plus efficiency equals production"
    ]
  }
];

export class CelebrityPersonaEngine {
}
  private selectedPersona: CelebrityPersona | null = null;

  selectPersona(personaId: string): CelebrityPersona | null {
}
    this.selectedPersona = CELEBRITY_PERSONAS.find((p: any) => p.id === personaId) || null;
    return this.selectedPersona;
  }

  getSelectedPersona(): CelebrityPersona | null {
}
    return this.selectedPersona;
  }

  getPersonaRecommendation(
    availablePlayers: Player[],
    currentRoster: Player[],
    pickNumber: number
  ): {
}
    recommendedPlayer: Player | null;
    reasoning: string;
    confidence: number;
    catchPhrase: string;
  } {
}
    if (!this.selectedPersona) {
}
      return {
}
        recommendedPlayer: null,
        reasoning: &apos;No persona selected&apos;,
        confidence: 0,
        catchPhrase: &apos;&apos;
      };
    }

    // Score each available player based on persona preferences
    const scoredPlayers = availablePlayers.map((player: any) => {
}
      let score = 0;
      const reasons: string[] = [];

      // Position preference scoring
      const positionIndex = this.selectedPersona!.strategies.positionPreference.indexOf(player.position);
      if (positionIndex !== -1) {
}
        score += (4 - positionIndex) * 25;
        reasons.push(`Preferred position (${player.position})`);
      }

      // Value vs ADP scoring
      if (player.adp && player.adp > pickNumber) {
}
        const valueDiff = player.adp - pickNumber;
        score += Math.min(valueDiff * 2, 40);
        reasons.push(`Great value (ADP: ${player.adp})`);
      }

      // Risk tolerance adjustment
      if (this.selectedPersona!.strategies.riskTolerance === &apos;conservative&apos;) {
}
        if (player.injuryStatus === &apos;healthy&apos;) score += 20;
        if (player.yearsExperience && player.yearsExperience > 3) score += 15;
      } else if (this.selectedPersona!.strategies.riskTolerance === &apos;aggressive&apos;) {
}
        if (player.upside === &apos;high&apos;) score += 25;
        if (player.age && player.age < 25) score += 15;
      }

      // Apply persona-specific factors
      this.selectedPersona!.strategies.valuationFactors.forEach((factor: any) => {
}
        // Simplified scoring based on factor names
        switch (factor.factor) {
}
          case &apos;consistency&apos;:
            if (player.consistency === &apos;high&apos;) score += 30 * factor.weight;
            break;
          case &apos;upside&apos;:
            if (player.upside === &apos;high&apos;) score += 30 * factor.weight;
            break;
          case &apos;age&apos;:
            if (player.age && player.age < 26) score += 25 * factor.weight;
            break;
          case &apos;veteran_presence&apos;:
            if (player.yearsExperience && player.yearsExperience > 5) score += 25 * factor.weight;
            break;
        }
      });

      return {
}
        player,
        score,// 
        reasons
      };
    });

    // Sort by score and get top recommendation
    scoredPlayers.sort((a, b) => b.score - a.score);
    const topPick = scoredPlayers[0];

    if (!topPick || topPick.score === 0) {
}
      return {
}
        recommendedPlayer: null,
        reasoning: &apos;No suitable players match persona preferences&apos;,
        confidence: 0,
        catchPhrase: &apos;&apos;
      };
    }

    // Calculate confidence based on score differential
    const confidence = Math.min(
      topPick.score / 100,
      scoredPlayers.length > 1 
        ? 0.5 + (topPick.score - scoredPlayers[1].score) / 100
        : 0.8
    );

    // Select a random catch phrase
    const catchPhrase = this.selectedPersona.catchPhrases[
      Math.floor(Math.random() * this.selectedPersona.catchPhrases.length)
    ];

    return {
}
      recommendedPlayer: topPick.player,
      reasoning: topPick.reasons.join(&apos;, &apos;),
      confidence,// 
      catchPhrase
    };
  }

  getPersonaTip(): string {
}
    if (!this.selectedPersona) return &apos;&apos;;
    return this.selectedPersona.draftTips[
      Math.floor(Math.random() * this.selectedPersona.draftTips.length)
    ];
  }
}