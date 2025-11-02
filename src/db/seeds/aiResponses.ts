import { db } from '@/db';
import { aiResponses } from '@/db/schema';

async function main() {
    const now = Date.now();
    
    const sampleResponses = [
        {
            responseText: 'System diagnostics complete. All subsystems operating at optimal efficiency. No anomalies detected.',
            createdAt: new Date(now - (6 * 24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000) + (15 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Weather update: Current temperature is 72°F with clear skies. UV index moderate. Perfect conditions for outdoor activities.',
            createdAt: new Date(now - (6 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (30 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Task completed: Database backup finished successfully. 2.4GB backed up to secure storage.',
            createdAt: new Date(now - (5 * 24 * 60 * 60 * 1000) + (22 * 60 * 60 * 1000) + (45 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Security scan complete. No threats detected. All access points secured. Firewall status: active.',
            createdAt: new Date(now - (4 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) + (20 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Calendar reminder: You have a team meeting scheduled in 30 minutes. Conference room B is reserved.',
            createdAt: new Date(now - (3 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000) + (10 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Energy optimization report: Smart home systems reduced power consumption by 15% this week.',
            createdAt: new Date(now - (3 * 24 * 60 * 60 * 1000) + (19 * 60 * 60 * 1000) + (55 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Network status: All devices connected. Average bandwidth utilization: 42%. Connection stable.',
            createdAt: new Date(now - (2 * 24 * 60 * 60 * 1000) + (11 * 60 * 60 * 1000) + (25 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Air quality analysis: Indoor CO2 levels optimal at 450 ppm. Humidity at comfortable 45%.',
            createdAt: new Date(now - (1 * 24 * 60 * 60 * 1000) + (16 * 60 * 60 * 1000) + (40 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Predictive maintenance alert: HVAC filter replacement recommended within next 2 weeks based on usage patterns.',
            createdAt: new Date(now - (1 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000) + (5 * 60 * 1000)).toISOString(),
        },
        {
            responseText: 'Daily summary: Processed 147 requests today. Response time average: 0.8 seconds. User satisfaction: 98%.',
            createdAt: new Date(now - (0 * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000) + (30 * 60 * 1000)).toISOString(),
        },
    ];

    await db.insert(aiResponses).values(sampleResponses);
    
    console.log('✅ AI responses seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});