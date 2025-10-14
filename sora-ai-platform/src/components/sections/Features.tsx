import React from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const Features: React.FC = () => {
  const features = [
    {
      icon: 'check',
      title: '简单易用',
      description: '只需输入文字描述，AI自动生成专业视频'
    },
    {
      icon: 'star',
      title: '专业质量',
      description: '基于先进AI技术，生成电影级视频质量'
    },
    {
      icon: 'play',
      title: '快速生成',
      description: '几分钟内完成从创意到成品的全过程'
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
          <p className="text-lg text-gray-600">强大的AI技术，简单易用的界面</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name={feature.icon} className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
