// Sora2 AI视频生成器前端应用
class SoraApp {
    constructor() {
        this.ws = null;
        this.currentTaskId = null;
        this.isGenerating = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initWebSocket();
        this.updateCharCount();
    }

    // 绑定事件
    bindEvents() {
        // 表单提交
        document.getElementById('videoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // 清空表单
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });

        // 字符计数
        document.getElementById('prompt').addEventListener('input', () => {
            this.updateCharCount();
        });

        // 示例点击
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.dataset.prompt;
                document.getElementById('prompt').value = prompt;
                this.updateCharCount();
            });
        });

        // 结果操作按钮
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadVideo();
        });

        document.getElementById('newVideoBtn').addEventListener('click', () => {
            this.showForm();
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.retryGeneration();
        });
    }

    // 初始化WebSocket连接
    initWebSocket() {
        const wsUrl = `ws://localhost:3001`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket连接已建立');
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket连接已关闭');
                // 尝试重连
                setTimeout(() => {
                    this.initWebSocket();
                }, 3000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket错误:', error);
            };
        } catch (error) {
            console.error('WebSocket初始化失败:', error);
            // 如果WebSocket失败，使用HTTP API
            this.useHttpApi = true;
        }
    }

    // 处理WebSocket消息
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'result':
                this.handleGenerationResult(data.data);
                break;
            case 'progress':
                this.updateProgress(data.data);
                break;
            case 'final':
                this.handleFinalResult(data.data);
                break;
            case 'error':
                this.showError(data.message);
                break;
            case 'timeout':
                this.showError('视频生成时间较长，请稍后重试');
                break;
        }
    }

    // 处理表单提交
    async handleFormSubmit() {
        if (this.isGenerating) {
            return;
        }

        const formData = this.getFormData();
        
        // 验证表单
        if (!this.validateForm(formData)) {
            return;
        }

        this.isGenerating = true;
        this.showProgress();
        this.updateGenerateButton();

        try {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // 使用WebSocket
                this.ws.send(JSON.stringify({
                    type: 'generate',
                    params: formData
                }));
            } else {
                // 使用HTTP API
                await this.generateVideoHttp(formData);
            }
        } catch (error) {
            this.showError('生成失败: ' + error.message);
            this.isGenerating = false;
            this.updateGenerateButton();
        }
    }

    // HTTP API生成视频
    async generateVideoHttp(formData) {
        try {
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.code === 0) {
                this.currentTaskId = result.data.id;
                this.startPolling();
            } else {
                this.showError(result.msg || '生成失败');
                this.isGenerating = false;
                this.updateGenerateButton();
            }
        } catch (error) {
            this.showError('网络错误: ' + error.message);
            this.isGenerating = false;
            this.updateGenerateButton();
        }
    }

    // 开始轮询结果
    startPolling() {
        let pollCount = 0;
        const maxPolls = 120; // 最多轮询120次（6分钟）
        
        const pollInterval = setInterval(async () => {
            pollCount++;
            
            try {
                const response = await fetch('/api/get-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: this.currentTaskId })
                });

                const result = await response.json();
                
                if (result.code === 0 && result.data) {
                    this.updateProgress(result.data);
                    
                    if (result.data.status === 'succeeded') {
                        clearInterval(pollInterval);
                        this.handleFinalResult(result.data);
                    } else if (result.data.status === 'failed') {
                        clearInterval(pollInterval);
                        this.showError(result.data.error || '生成失败');
                        this.isGenerating = false;
                        this.updateGenerateButton();
                    } else if (pollCount >= maxPolls) {
                        // 超时处理
                        clearInterval(pollInterval);
                        this.showError('视频生成时间较长，请稍后重试');
                        this.isGenerating = false;
                        this.updateGenerateButton();
                    }
                } else {
                    clearInterval(pollInterval);
                    this.showError(result.msg || '获取结果失败');
                    this.isGenerating = false;
                    this.updateGenerateButton();
                }
            } catch (error) {
                clearInterval(pollInterval);
                this.showError('轮询失败: ' + error.message);
                this.isGenerating = false;
                this.updateGenerateButton();
            }
        }, 3000); // 每3秒轮询一次
    }

    // 获取表单数据
    getFormData() {
        return {
            prompt: document.getElementById('prompt').value.trim(),
            url: document.getElementById('url').value.trim(),
            aspectRatio: document.getElementById('aspectRatio').value,
            duration: parseInt(document.getElementById('duration').value),
            size: document.getElementById('size').value
        };
    }

    // 验证表单
    validateForm(data) {
        if (!data.prompt) {
            this.showError('请输入视频描述');
            return false;
        }

        if (data.prompt.length > 500) {
            this.showError('提示词不能超过500个字符');
            return false;
        }

        if (data.url && !this.isValidUrl(data.url)) {
            this.showError('请输入有效的图片URL');
            return false;
        }

        return true;
    }

    // 验证URL
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // 处理生成结果
    handleGenerationResult(result) {
        if (result.code === 0) {
            this.currentTaskId = result.data.id;
            // 任务ID仅用于内部处理，不显示给用户
        } else {
            this.showError(result.msg || '生成失败');
            this.isGenerating = false;
            this.updateGenerateButton();
        }
    }

    // 更新进度
    updateProgress(data) {
        const progress = data.progress || 0;
        const status = data.status || 'running';
        
        document.getElementById('progressBar').style.width = `${progress}%`;
        
        let progressText = `进度: ${progress}%`;
        if (status === 'running') {
            progressText += ' - 正在生成中...';
        } else if (status === 'succeeded') {
            progressText += ' - 生成完成！';
        } else if (status === 'failed') {
            progressText += ' - 生成失败';
        }
        
        document.getElementById('progressText').textContent = progressText;
    }

    // 处理最终结果
    handleFinalResult(data) {
        this.isGenerating = false;
        this.updateGenerateButton();
        
        if (data.status === 'succeeded' && data.results && data.results.length > 0) {
            this.showResult(data.results[0].url);
        } else {
            this.showError(data.error || '生成失败');
        }
    }

    // 显示结果
    showResult(videoUrl) {
        this.hideAllSections();
        
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = `
            <video controls autoplay muted>
                <source src="${videoUrl}" type="video/mp4">
                您的浏览器不支持视频播放
            </video>
        `;
        
        // 保存视频URL用于下载
        this.currentVideoUrl = videoUrl;
        
        document.getElementById('resultSection').style.display = 'block';
    }

    // 显示进度
    showProgress() {
        this.hideAllSections();
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').textContent = '准备中...';
    }

    // 显示错误
    showError(message) {
        this.hideAllSections();
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
        this.isGenerating = false;
        this.updateGenerateButton();
    }

    // 显示表单
    showForm() {
        this.hideAllSections();
        document.querySelector('.form-section').style.display = 'block';
    }

    // 隐藏所有部分
    hideAllSections() {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
    }

    // 更新生成按钮状态
    updateGenerateButton() {
        const btn = document.getElementById('generateBtn');
        if (this.isGenerating) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-play"></i> 生成视频';
        }
    }

    // 更新字符计数
    updateCharCount() {
        const textarea = document.getElementById('prompt');
        const charCount = document.getElementById('charCount');
        const count = textarea.value.length;
        
        charCount.textContent = count;
        
        if (count > 500) {
            charCount.style.color = '#e53e3e';
        } else if (count > 400) {
            charCount.style.color = '#ed8936';
        } else {
            charCount.style.color = '#718096';
        }
    }

    // 清空表单
    clearForm() {
        document.getElementById('videoForm').reset();
        this.updateCharCount();
        this.showForm();
    }

    // 下载视频
    downloadVideo() {
        if (this.currentVideoUrl) {
            const link = document.createElement('a');
            link.href = this.currentVideoUrl;
            link.download = `sora-video-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // 重试生成
    retryGeneration() {
        this.showForm();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SoraApp();
});
