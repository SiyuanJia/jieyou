// 简单的访问统计显示
(function() {
    // ========== 手动设置区域 ==========
    // 您可以在这里手动设置想要显示的数字
    const MANUAL_SETTINGS = {
        // 设置为 true 启用手动模式，false 启用自动计数模式
        enableManualMode: true,

        // 手动设置的数字（仅在 enableManualMode 为 true 时生效）
        manualVisitCount: 125,      // 手动设置访问次数
        manualVisitorCount: 96,     // 手动设置访问人数

        // 自动模式的基础数字（在自动计数基础上加上这些数字）
        baseVisitCount: 100,        // 访问次数基础值
        baseVisitorCount: 40        // 访问人数基础值
    };
    // ================================

    // 从localStorage获取或初始化统计数据
    function getStoredStats() {
        const stored = localStorage.getItem('siteStats');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            visitCount: 0,
            visitorCount: 0,
            lastVisit: null
        };
    }

    // 保存统计数据到localStorage
    function saveStats(stats) {
        localStorage.setItem('siteStats', JSON.stringify(stats));
    }

    // 更新访问统计
    function updateStats() {
        if (MANUAL_SETTINGS.enableManualMode) {
            // 手动模式：直接返回手动设置的数字
            return {
                visitCount: MANUAL_SETTINGS.manualVisitCount,
                visitorCount: MANUAL_SETTINGS.manualVisitorCount
            };
        } else {
            // 自动模式：在基础数字上累加实际访问
            const stats = getStoredStats();
            const now = new Date().toDateString();

            // 每次访问都增加访问次数
            stats.visitCount++;

            // 如果是新的一天或者首次访问，增加访问人数
            if (stats.lastVisit !== now) {
                stats.visitorCount++;
                stats.lastVisit = now;
            }

            saveStats(stats);

            // 返回基础数字 + 实际统计
            return {
                visitCount: MANUAL_SETTINGS.baseVisitCount + stats.visitCount,
                visitorCount: MANUAL_SETTINGS.baseVisitorCount + stats.visitorCount
            };
        }
    }

    // 显示统计数据
    function displayStats() {
        const stats = updateStats();

        const visitCountElement = document.getElementById('visit-count');
        const visitorCountElement = document.getElementById('visitor-count');

        if (visitCountElement) {
            visitCountElement.textContent = stats.visitCount;
        }

        if (visitorCountElement) {
            visitorCountElement.textContent = stats.visitorCount;
        }
    }

    // 页面加载完成后显示统计
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displayStats);
    } else {
        displayStats();
    }

    // 开发者工具：在控制台中可以使用以下函数
    window.updateSiteStats = function(visitCount, visitorCount) {
        console.log(`更新统计数据: 访问次数=${visitCount}, 访问人数=${visitorCount}`);
        document.getElementById('visit-count').textContent = visitCount;
        document.getElementById('visitor-count').textContent = visitorCount;
    };
})();
