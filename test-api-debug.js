// 测试API调试脚本
const testAPI = async () => {
  try {
    console.log('🧪 开始测试API...');
    
    // 测试生成视频API
    const response = await fetch('http://localhost:3000/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '一只可爱的小猫在花园里玩耍',
        aspectRatio: '16:9',
        duration: 15,
        size: 'medium',
        style: 'realistic',
        motion: 'medium'
      })
    });
    
    console.log('📡 响应状态:', response.status);
    console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📄 响应数据:', data);
    
    if (response.ok) {
      console.log('✅ API调用成功');
    } else {
      console.log('❌ API调用失败:', data.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
};

// 等待服务器启动
setTimeout(testAPI, 3000);

