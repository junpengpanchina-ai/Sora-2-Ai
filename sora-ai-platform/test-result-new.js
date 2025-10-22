// 测试获取结果
async function testGetResult() {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const baseUrl = 'https://grsai.dakka.com.cn';
  const taskId = 'd9e81352-ee1d-4186-98cb-25a8b03181c6'; // 从上面的测试获取的 ID
  
  console.log('🔍 测试获取视频生成结果...');
  console.log('任务 ID:', taskId);
  
  try {
    const response = await fetch(`${baseUrl}/v1/draw/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ id: taskId })
    });

    console.log('📡 响应状态:', response.status);
    
    const data = await response.json();
    console.log('📄 响应数据:', JSON.stringify(data, null, 2));
    
    if (data.code === 0 && data.data) {
      console.log('✅ 获取结果成功！');
      console.log('状态:', data.data.status);
      console.log('进度:', data.data.progress);
      if (data.data.results && data.data.results.length > 0) {
        console.log('视频 URL:', data.data.results[0].url);
      }
    } else {
      console.log('❌ 获取结果失败:', data.msg);
    }
    
  } catch (error) {
    console.error('❌ 连接错误:', error.message);
  }
}

testGetResult();
