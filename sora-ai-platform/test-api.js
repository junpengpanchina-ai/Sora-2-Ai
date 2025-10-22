// 测试 Sora API 连接

async function testSoraAPI() {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const baseUrl = 'https://grsai.dakka.com.cn';
  
  console.log('🔍 测试 Sora API 连接...');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('Base URL:', baseUrl);
  
  try {
    const response = await fetch(`${baseUrl}/v1/video/sora-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'sora-2',
        prompt: 'A beautiful sunset over the ocean',
        url: '',
        aspectRatio: '16:9',
        duration: 10,
        size: 'small',
        webHook: '-1',
        shutProgress: false
      })
    });

    console.log('📡 响应状态:', response.status);
    console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📄 响应数据:', JSON.stringify(data, null, 2));
    
    if (data.code === 0) {
      console.log('✅ API 调用成功！');
      console.log('任务 ID:', data.data?.id);
    } else {
      console.log('❌ API 调用失败:', data.msg);
    }
    
  } catch (error) {
    console.error('❌ 连接错误:', error.message);
  }
}

testSoraAPI();
