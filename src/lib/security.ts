// 安全防护系统
import { prisma } from './prisma'

export interface SecurityThreat {
  id: string
  type: 'suspicious' | 'malicious' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  timestamp: Date
  resolved: boolean
  metadata: {
    ipAddress?: string
    userAgent?: string
    location?: string
    riskScore?: number
    indicators?: string[]
  }
}

export interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'suspicious_activity' | 'data_access' | 'system_alert'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
  timestamp: Date
}

export interface SecurityMetrics {
  totalThreats: number
  activeThreats: number
  resolvedThreats: number
  securityScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastScan: Date
}

// 威胁检测引擎
export class ThreatDetectionEngine {
  private static instance: ThreatDetectionEngine
  private threatPatterns: Map<string, RegExp> = new Map()
  private suspiciousIPs: Set<string> = new Set()
  private blockedIPs: Set<string> = new Set()

  constructor() {
    this.initializePatterns()
  }

  static getInstance(): ThreatDetectionEngine {
    if (!ThreatDetectionEngine.instance) {
      ThreatDetectionEngine.instance = new ThreatDetectionEngine()
    }
    return ThreatDetectionEngine.instance
  }

  private initializePatterns() {
    // SQL注入模式
    this.threatPatterns.set('sql_injection', /('|(\\')|(;)|(\\;)|(union)|(select)|(insert)|(update)|(delete)|(drop)|(create)|(alter))/i)
    
    // XSS模式
    this.threatPatterns.set('xss', /(<script)|(javascript:)|(onload=)|(onerror=)|(onclick=)/i)
    
    // 路径遍历模式
    this.threatPatterns.set('path_traversal', /(\.\.\/)|(\.\.\\)|(\.\.%2f)|(\.\.%5c)/i)
    
    // 命令注入模式
    this.threatPatterns.set('command_injection', /(;)|(\|)|(&)|(&&)|(\|\|)|(rm)|(del)|(cat)|(ls)|(dir)/i)
    
    // 暴力破解模式
    this.threatPatterns.set('brute_force', /(admin)|(password)|(123456)|(qwerty)|(login)/i)
  }

  // 检测威胁
  detectThreat(input: string, context: {
    ipAddress?: string
    userAgent?: string
    userId?: string
    endpoint?: string
  }): SecurityThreat | null {
    const threats: SecurityThreat[] = []
    
    // 检查已知威胁模式
    for (const [patternName, pattern] of this.threatPatterns) {
      if (pattern.test(input)) {
        threats.push({
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: this.getThreatType(patternName),
          severity: this.getThreatSeverity(patternName),
          title: this.getThreatTitle(patternName),
          description: this.getThreatDescription(patternName),
          source: context.endpoint || 'unknown',
          timestamp: new Date(),
          resolved: false,
          metadata: {
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            riskScore: this.calculateRiskScore(patternName, context),
            indicators: [patternName]
          }
        })
      }
    }
    
    // 检查IP地址威胁
    if (context.ipAddress) {
      if (this.suspiciousIPs.has(context.ipAddress)) {
        threats.push({
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'suspicious',
          severity: 'medium',
          title: '可疑IP地址',
          description: '检测到来自可疑IP地址的请求',
          source: context.endpoint || 'unknown',
          timestamp: new Date(),
          resolved: false,
          metadata: {
            ipAddress: context.ipAddress,
            riskScore: 0.7,
            indicators: ['suspicious_ip']
          }
        })
      }
      
      if (this.blockedIPs.has(context.ipAddress)) {
        threats.push({
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'malicious',
          severity: 'critical',
          title: '被阻止的IP地址',
          description: '检测到来自被阻止IP地址的请求',
          source: context.endpoint || 'unknown',
          timestamp: new Date(),
          resolved: false,
          metadata: {
            ipAddress: context.ipAddress,
            riskScore: 1.0,
            indicators: ['blocked_ip']
          }
        })
      }
    }
    
    // 检查异常行为
    if (context.userId) {
      const abnormalBehavior = this.detectAbnormalBehavior(context)
      if (abnormalBehavior) {
        threats.push(abnormalBehavior)
      }
    }
    
    return threats.length > 0 ? threats[0] : null
  }

  private getThreatType(patternName: string): SecurityThreat['type'] {
    switch (patternName) {
      case 'sql_injection':
      case 'xss':
      case 'command_injection':
        return 'malicious'
      case 'path_traversal':
        return 'suspicious'
      case 'brute_force':
        return 'warning'
      default:
        return 'info'
    }
  }

  private getThreatSeverity(patternName: string): SecurityThreat['severity'] {
    switch (patternName) {
      case 'sql_injection':
      case 'xss':
      case 'command_injection':
        return 'critical'
      case 'path_traversal':
        return 'high'
      case 'brute_force':
        return 'medium'
      default:
        return 'low'
    }
  }

  private getThreatTitle(patternName: string): string {
    switch (patternName) {
      case 'sql_injection':
        return 'SQL注入攻击'
      case 'xss':
        return '跨站脚本攻击'
      case 'command_injection':
        return '命令注入攻击'
      case 'path_traversal':
        return '路径遍历攻击'
      case 'brute_force':
        return '暴力破解尝试'
      default:
        return '安全威胁'
    }
  }

  private getThreatDescription(patternName: string): string {
    switch (patternName) {
      case 'sql_injection':
        return '检测到SQL注入攻击尝试，可能试图访问或修改数据库'
      case 'xss':
        return '检测到跨站脚本攻击尝试，可能试图执行恶意脚本'
      case 'command_injection':
        return '检测到命令注入攻击尝试，可能试图执行系统命令'
      case 'path_traversal':
        return '检测到路径遍历攻击尝试，可能试图访问系统文件'
      case 'brute_force':
        return '检测到暴力破解尝试，可能试图猜测密码'
      default:
        return '检测到潜在的安全威胁'
    }
  }

  private calculateRiskScore(patternName: string, context: any): number {
    let score = 0.5
    
    switch (patternName) {
      case 'sql_injection':
      case 'xss':
      case 'command_injection':
        score = 0.9
        break
      case 'path_traversal':
        score = 0.7
        break
      case 'brute_force':
        score = 0.6
        break
    }
    
    // 根据上下文调整风险分数
    if (context.ipAddress && this.suspiciousIPs.has(context.ipAddress)) {
      score += 0.2
    }
    
    if (context.userAgent && context.userAgent.includes('bot')) {
      score += 0.1
    }
    
    return Math.min(score, 1.0)
  }

  private detectAbnormalBehavior(context: any): SecurityThreat | null {
    // 这里可以实现更复杂的异常行为检测逻辑
    // 例如：检测异常登录时间、异常地理位置、异常请求频率等
    
    return null
  }

  // 添加可疑IP
  addSuspiciousIP(ip: string) {
    this.suspiciousIPs.add(ip)
  }

  // 添加被阻止IP
  addBlockedIP(ip: string) {
    this.blockedIPs.add(ip)
  }

  // 移除IP
  removeIP(ip: string) {
    this.suspiciousIPs.delete(ip)
    this.blockedIPs.delete(ip)
  }
}

// 安全事件记录
export async function recordSecurityEvent(event: SecurityEvent): Promise<void> {
  await prisma.userActivity.create({
    data: {
      userId: event.userId || 'system',
      action: 'security_event',
      details: JSON.stringify(event),
      ipAddress: event.ipAddress,
      userAgent: event.userAgent
    }
  })
}

// 获取安全指标
export async function getSecurityMetrics(): Promise<SecurityMetrics> {
  const activities = await prisma.userActivity.findMany({
    where: {
      action: 'security_event'
    },
    orderBy: { createdAt: 'desc' },
    take: 1000
  })
  
  const threats: SecurityThreat[] = []
  
  for (const activity of activities) {
    try {
      const event = JSON.parse(activity.details)
      if (event.severity) {
        threats.push({
          id: activity.id,
          type: event.type || 'info',
          severity: event.severity,
          title: event.title || '安全事件',
          description: event.description || '',
          source: event.source || 'unknown',
          timestamp: activity.createdAt,
          resolved: event.resolved || false,
          metadata: event.metadata || {}
        })
      }
    } catch (error) {
      console.error('解析安全事件失败:', error)
    }
  }
  
  const totalThreats = threats.length
  const activeThreats = threats.filter(t => !t.resolved).length
  const resolvedThreats = threats.filter(t => t.resolved).length
  
  // 计算安全分数
  const criticalThreats = threats.filter(t => t.severity === 'critical').length
  const highThreats = threats.filter(t => t.severity === 'high').length
  const mediumThreats = threats.filter(t => t.severity === 'medium').length
  
  const securityScore = Math.max(0, 100 - (criticalThreats * 20 + highThreats * 10 + mediumThreats * 5))
  
  let riskLevel: SecurityMetrics['riskLevel'] = 'low'
  if (criticalThreats > 0) riskLevel = 'critical'
  else if (highThreats > 2) riskLevel = 'high'
  else if (mediumThreats > 5) riskLevel = 'medium'
  
  return {
    totalThreats,
    activeThreats,
    resolvedThreats,
    securityScore,
    riskLevel,
    lastScan: new Date()
  }
}

// 获取威胁列表
export async function getThreats(limit: number = 50): Promise<SecurityThreat[]> {
  const activities = await prisma.userActivity.findMany({
    where: {
      action: 'security_event'
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
  
  const threats: SecurityThreat[] = []
  
  for (const activity of activities) {
    try {
      const event = JSON.parse(activity.details)
      if (event.severity) {
        threats.push({
          id: activity.id,
          type: event.type || 'info',
          severity: event.severity,
          title: event.title || '安全事件',
          description: event.description || '',
          source: event.source || 'unknown',
          timestamp: activity.createdAt,
          resolved: event.resolved || false,
          metadata: event.metadata || {}
        })
      }
    } catch (error) {
      console.error('解析威胁数据失败:', error)
    }
  }
  
  return threats
}

// 解决威胁
export async function resolveThreat(threatId: string): Promise<void> {
  await prisma.userActivity.update({
    where: { id: threatId },
    data: {
      details: JSON.stringify({
        ...JSON.parse((await prisma.userActivity.findUnique({ where: { id: threatId } }))?.details || '{}'),
        resolved: true,
        resolvedAt: new Date()
      })
    }
  })
}

// 安全扫描
export async function performSecurityScan(): Promise<SecurityThreat[]> {
  const detector = ThreatDetectionEngine.getInstance()
  const threats: SecurityThreat[] = []
  
  // 这里可以实现更全面的安全扫描逻辑
  // 例如：扫描数据库、检查文件权限、验证配置等
  
  return threats
}
