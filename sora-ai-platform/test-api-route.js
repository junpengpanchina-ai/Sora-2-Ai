// 测试 API 路由

async function testAPIRoute() {
  console.log('🔍 测试 API 路由...');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'test video',
        duration: 5,
        aspectRatio: '16:9',
        size: 'small',
        style: 'realistic',
        motion: 'medium'
      })
    });

    console.log('📡 响应状态:', response.status);
    console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('📄 响应数据:', data);
    
    if (response.status === 401) {
      console.log('✅ 401 错误是预期的（需要登录）');
    } else if (response.status === 500) {
      console.log('❌ 500 内部服务器错误');
    } else {
      console.log('📊 其他状态码:', response.status);
    }
    
  } catch (error) {
    console.error('❌ 连接错误:', error.message);
  }
}

testAPIRoute();
