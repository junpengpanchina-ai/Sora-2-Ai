import React from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { useTranslations } from '@/hooks/useTranslations';

const Features: React.FC = () => {
  const t = useTranslations();
  const features = [
    {
      icon: 'check',
      title: t.home('features.easyToUse.title'),
      description: t.home('features.easyToUse.description')
    },
    {
      icon: 'star',
      title: t.home('features.aiGeneration.title'),
      description: t.home('features.aiGeneration.description')
    },
    {
      icon: 'play',
      title: t.home('features.fastProcessing.title'),
      description: t.home('features.fastProcessing.description')
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.home('features.title')}</h2>
          <p className="text-lg text-gray-600">{t.home('subtitle')}</p>
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
