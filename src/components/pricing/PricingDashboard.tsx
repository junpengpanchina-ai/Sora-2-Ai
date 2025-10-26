'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { 
  PRICING_TIERS, 
  PricingTier, 
  calculateProfitAnalysis,
  calculateCustomerAcquisitionCost,
  getDynamicPricing 
} from '@/lib/pricing-calculator'
import { 
  generatePricingAnalysisReport,
  getPricingStrategyRecommendations,
  getTaxOptimizationRecommendations 
} from '@/lib/pricing-analysis'

export default function PricingDashboard() {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(PRICING_TIERS[0])
  const [showAnalysis, setShowAnalysis] = useState(false)

  const analysis = generatePricingAnalysisReport(selectedTier)
  const strategyRecommendations = getPricingStrategyRecommendations()
  const taxRecommendations = getTaxOptimizationRecommendations()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和说明 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ 风险对抗价格模型 - 60%以上毛利率 (USD定价)
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            基于$0.011/秒成本，设计的高毛利率风险对抗策略
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Icon name="shield-check" className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold text-green-800">风险对抗策略</span>
            </div>
            <p className="text-green-700">
              <strong>体验版</strong>：邀请制获客，142%利润率 | 
              <strong>创作者版</strong>：$2.75低价切入，150%利润率 | 
              <strong>专业版</strong>：$8.25主流定价，150%利润率 | 
              <strong>企业版</strong>：$27.50高端市场，148%利润率
            </p>
          </div>
        </div>

        {/* 定价方案展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PRICING_TIERS.map((tier, index) => (
            <Card 
              key={tier.name}
              className={`p-6 cursor-pointer transition-all duration-200 ${
                selectedTier.name === tier.name 
                  ? 'ring-2 ring-primary-500 shadow-lg scale-105' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedTier(tier)}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  index === 0 ? 'bg-green-100' : 
                  index === 1 ? 'bg-blue-100' : 
                  index === 2 ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <span className={`text-xl font-bold ${
                    index === 0 ? 'text-green-600' : 
                    index === 1 ? 'text-blue-600' : 
                    index === 2 ? 'text-purple-600' : 'text-orange-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${tier.monthlyPrice.toFixed(2)}
                  </span>
                  {tier.monthlyPrice > 0 && <span className="text-gray-600">/月</span>}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>视频数量:</span>
                    <span className="font-semibold">{tier.monthlyVideos}个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>时长限制:</span>
                    <span className="font-semibold">{tier.maxDuration}秒</span>
                  </div>
                  <div className="flex justify-between">
                    <span>单视频成本:</span>
                    <span className="font-semibold">${(tier.maxDuration * tier.costPerSecond).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>利润率:</span>
                    <span className={`font-semibold ${
                      tier.marginMultiplier > 2 ? 'text-green-600' : 
                      tier.marginMultiplier > 1.2 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {((tier.marginMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  目标: {tier.targetAudience}
                </div>

                <Button 
                  variant={selectedTier.name === tier.name ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                >
                  {selectedTier.name === tier.name ? '已选择' : '选择方案'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 详细分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 成本分析 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Icon name="calculator" className="h-5 w-5 mr-2 text-blue-500" />
              成本结构分析 - {selectedTier.name}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">基础成本 (AI生成)</span>
                <span className="font-bold text-red-600">
                  ${(analysis.costStructure.baseCost).toFixed(3)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">平台成本 (服务器/带宽)</span>
                <span className="font-bold text-orange-600">
                  ${(analysis.costStructure.platformCost).toFixed(3)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">客服成本</span>
                <span className="font-bold text-yellow-600">
                  ${(analysis.costStructure.supportCost).toFixed(3)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">营销成本</span>
                <span className="font-bold text-purple-600">
                  ${(analysis.costStructure.marketingCost).toFixed(3)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                <span className="font-bold text-blue-800">总成本</span>
                <span className="font-bold text-blue-800">
                  ${(analysis.costStructure.totalCost).toFixed(3)}
                </span>
              </div>
            </div>
          </Card>

          {/* 收入分析 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Icon name="trending-up" className="h-5 w-5 mr-2 text-green-500" />
              收入结构分析 - {selectedTier.name}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">订阅收入</span>
                <span className="font-bold text-green-600">
                  ${(analysis.revenueStructure.subscriptionRevenue).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">超量收入</span>
                <span className="font-bold text-blue-600">
                  ${(analysis.revenueStructure.overageRevenue).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">推荐收入</span>
                <span className="font-bold text-purple-600">
                  ${(analysis.revenueStructure.referralRevenue).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                <span className="font-bold text-green-800">总收入</span>
                <span className="font-bold text-green-800">
                  ${(analysis.revenueStructure.totalRevenue).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 盈利分析 */}
        <Card className="p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Icon name="chart-bar" className="h-5 w-5 mr-2 text-purple-500" />
            盈利分析 - {selectedTier.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ${(analysis.profitAnalysis.profit).toFixed(2)}
              </div>
              <div className="text-sm text-green-700">月净利润</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {(analysis.profitAnalysis.profitMargin).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">利润率</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                ${(analysis.customerAcquisition.lifetimeValue).toFixed(0)}
              </div>
              <div className="text-sm text-purple-700">生命周期价值</div>
            </div>
          </div>
        </Card>

        {/* 策略建议 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 获客策略 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Icon name="users" className="h-5 w-5 mr-2 text-blue-500" />
              获客策略建议
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">体验版策略</h4>
                <p className="text-sm text-green-700">
                  邀请制获客，成本${(strategyRecommendations.acquisitionStrategy.freeTier.costPerAcquisition).toFixed(3)}/用户，
                  转化率{strategyRecommendations.acquisitionStrategy.freeTier.conversionRate * 100}%，
                  建议预算${strategyRecommendations.acquisitionStrategy.freeTier.recommendedBudget.toFixed(0)}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">留存策略</h4>
                <p className="text-sm text-blue-700">
                  当前流失率{(strategyRecommendations.retentionStrategy.churnReduction.currentChurn * 100).toFixed(1)}%，
                  目标{(strategyRecommendations.retentionStrategy.churnReduction.targetChurn * 100).toFixed(1)}%
                </p>
                <ul className="text-xs text-blue-600 mt-2">
                  {strategyRecommendations.retentionStrategy.churnReduction.strategies.map((strategy, index) => (
                    <li key={index}>• {strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* 税务优化 */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Icon name="shield-check" className="h-5 w-5 mr-2 text-green-500" />
              税务优化建议
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">国际税务规划</h4>
                <p className="text-sm text-blue-700">
                  {taxRecommendations.internationalTaxPlanning.transferPricing.recommendation}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">电商税务优化</h4>
                <p className="text-sm text-green-700">
                  {taxRecommendations.ecommerceTaxOptimization.digitalServicesTax.recommendation}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">成本管理优化</h4>
                <p className="text-sm text-purple-700">
                  {taxRecommendations.costManagementOptimization.activityBasedCosting.recommendation}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 行动建议 */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Icon name="lightning-bolt" className="h-5 w-5 mr-2 text-yellow-500" />
            立即行动建议
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Icon name="fire" className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-semibold text-red-800 mb-2">短期获客</h4>
                <p className="text-sm text-red-700">
                  立即推出邀请制体验版，快速建立用户基础
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Icon name="trending-up" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">中期增长</h4>
                <p className="text-sm text-blue-700">
                  创作者版$1.36低价切入，专业版$4.10主流定价
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Icon name="crown" className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 mb-2">长期盈利</h4>
                <p className="text-sm text-green-700">
                  企业版$13.70高端市场，建立可持续盈利模式
                </p>
              </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
