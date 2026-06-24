const { Core } = require('@adobe/aio-sdk');
const stateLib = require('@adobe/aio-lib-state');

function safeJsonParse(value) {
  if (value == null) {
    return null;
  }
  if (typeof value === 'object') {
    return value;
  }
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

async function main(params) {
  const logger = Core.Logger('fetch-enriched-orders', {
    level: params.LOG_LEVEL || 'info',
  });

  try {
    const state = await stateLib.init();
    const limitRaw = Number(params.limit || 25);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 25;

    const keys = [];
    for await (const { keys: pageKeys } of state.list({ match: 'order-*', countHint: 200 })) {
      keys.push(...pageKeys);
    }

    const orders = [];
    for (const key of keys) {
      const record = await state.get(key);
      const parsed = safeJsonParse(record?.value);
      if (parsed) {
        orders.push(parsed);
      }
    }

    orders.sort((a, b) => {
      const aTime = Date.parse(a.processedAt || 0);
      const bTime = Date.parse(b.processedAt || 0);
      return bTime - aTime;
    });

    const limitedOrders = orders.slice(0, limit);
    logger.info(`Returning ${limitedOrders.length} enriched orders`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: {
        total: orders.length,
        count: limitedOrders.length,
        orders: limitedOrders,
      },
    };
  } catch (error) {
    logger.error('Failed to fetch enriched orders:', error.message, error.stack);
    return {
      statusCode: 500,
      body: {
        error: 'Failed to fetch enriched orders',
      },
    };
  }
}

exports.main = main;