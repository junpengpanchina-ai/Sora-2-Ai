// 测试完整的视频生成流程
async function testCompleteFlow() {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const baseUrl = 'https://grsai.dakka.com.cn';
  
  console.log('🔍 测试完整的视频生成流程...');
  
  try {
    // 1. 创建视频生成任务
    console.log('📝 步骤 1: 创建视频生成任务');
    const createResponse = await fetch(`${baseUrl}/v1/video/sora-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'sora-2',
        prompt: 'A beautiful sunset over the ocean with waves',
        url: '',
        aspectRatio: '16:9',
        duration: 10,
        size: 'small',
        webHook: '-1',
        shutProgress: false
      })
    });

    const createData = await createResponse.json();
    console.log('📄 创建响应:', JSON.stringify(createData, null, 2));
    
    if (createData.code !== 0) {
      console.log('❌ 创建任务失败:', createData.msg);
      return;
    }
    
    const taskId = createData.data.id;
    console.log('✅ 任务创建成功，ID:', taskId);
    
    // 2. 轮询获取结果
    console.log('🔄 步骤 2: 开始轮询结果');
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
      
      console.log(`📊 轮询第 ${attempts + 1} 次...`);
      
      const resultResponse = await fetch(`${baseUrl}/v1/draw/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ id: taskId })
      });

      const resultData = await resultResponse.json();
      console.log('📄 结果响应:', JSON.stringify(resultData, null, 2));
      
      if (resultData.code === 0 && resultData.data) {
        const { status, progress, results, error, failure_reason } = resultData.data;
        
        console.log(`📈 状态: ${status}, 进度: ${progress}%`);
        
        if (status === 'succeeded') {
          console.log('🎉 视频生成成功！');
          if (results && results.length > 0) {
            console.log('🎬 视频 URL:', results[0].url);
          }
          break;
        } else if (status === 'failed') {
          console.log('❌ 视频生成失败');
          console.log('失败原因:', failure_reason);
          console.log('错误信息:', error);
          break;
        }
      } else {
        console.log('❌ 获取结果失败:', resultData.msg);
        break;
      }
      
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      console.log('⏰ 轮询超时');
    }
    
  } catch (error) {
    console.error('❌ 流程错误:', error.message);
  }
}

testCompleteFlow();
