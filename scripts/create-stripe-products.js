#!/usr/bin/env node

/**
 * Stripe产品创建脚本
 * 使用Stripe CLI或API创建订阅产品
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  console.log('🚀 开始创建Stripe产品...\n');

  try {
    // 创建基础版产品
    console.log('📦 创建基础版产品...');
    const basicProduct = await stripe.products.create({
      name: 'Sora AI 基础版',
      description: '适合个人用户的AI视频生成服务',
      metadata: {
        plan: 'basic',
        videosPerMonth: '15',
        maxDuration: '10',
        maxResolution: '720p'
      }
    });

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 4900, // ¥49.00 (以分为单位)
      currency: 'cny',
      recurring: {
        interval: 'month'
      },
      metadata: {
        priceId: 'price_basic_monthly'
      }
    });

    console.log(`✅ 基础版产品创建成功: ${basicProduct.id}`);
    console.log(`✅ 基础版价格创建成功: ${basicPrice.id}`);

    // 创建专业版产品
    console.log('\n📦 创建专业版产品...');
    const proProduct = await stripe.products.create({
      name: 'Sora AI 专业版',
      description: '适合内容创作者的高级AI视频生成服务',
      metadata: {
        plan: 'pro',
        videosPerMonth: '40',
        maxDuration: '15',
        maxResolution: '1080p'
      }
    });

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 19900, // ¥199.00 (以分为单位)
      currency: 'cny',
      recurring: {
        interval: 'month'
      },
      metadata: {
        priceId: 'price_pro_monthly'
      }
    });

    console.log(`✅ 专业版产品创建成功: ${proProduct.id}`);
    console.log(`✅ 专业版价格创建成功: ${proPrice.id}`);

    // 创建企业版产品
    console.log('\n📦 创建企业版产品...');
    const enterpriseProduct = await stripe.products.create({
      name: 'Sora AI 企业版',
      description: '适合团队和企业的企业级AI视频生成服务',
      metadata: {
        plan: 'enterprise',
        videosPerMonth: '120',
        maxDuration: '15',
        maxResolution: '4K'
      }
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 59900, // ¥599.00 (以分为单位)
      currency: 'cny',
      recurring: {
        interval: 'month'
      },
      metadata: {
        priceId: 'price_enterprise_monthly'
      }
    });

    console.log(`✅ 企业版产品创建成功: ${enterpriseProduct.id}`);
    console.log(`✅ 企业版价格创建成功: ${enterprisePrice.id}`);

    console.log('\n🎉 所有产品创建完成！');
    console.log('\n📋 产品信息汇总：');
    console.log(`基础版: ${basicProduct.id} - ${basicPrice.id}`);
    console.log(`专业版: ${proProduct.id} - ${proPrice.id}`);
    console.log(`企业版: ${enterpriseProduct.id} - ${enterprisePrice.id}`);

  } catch (error) {
    console.error('❌ 创建产品时出错:', error.message);
    process.exit(1);
  }
}

// 检查环境变量
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ 请设置 STRIPE_SECRET_KEY 环境变量');
  process.exit(1);
}

createProducts();

