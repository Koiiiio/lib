<template>
  <el-container class="body">
    <div class="header">
      <strong>LibChatBot</strong>
    </div>
    <div class="main">
      <div style="width: 270px" />
      <div class="message-content">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div class="question">
            <strong>Question:</strong> {{ message.question }}
          </div>
          <div class="answer">
            <strong>Answer:</strong>
            <div v-html="renderMarkdown(message.answer)"></div>
          </div>
        </div>
      </div>
      <div style="width: 270px" />
    </div>
    <div class="footer">
      <el-button circle round @click="clearMessages" size="large">
        <span>clear</span>
      </el-button>
      <div class="chatinput">
        <textarea class="area" v-model="input"></textarea>
      </div>
      <el-button circle round @click="sendToChatBot" size="large">
        <span>send</span>
      </el-button>
    </div>
  </el-container>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { marked } from 'marked'
const chatURL = import.meta.env.VITE_CHAT_API_URL
const input = ref('')
const messages = reactive([])

function clearMessages() {
  messages.splice(0, messages.length)
}

function renderMarkdown(markdown) {
  return marked(markdown)
}

async function sendToChatBot() {
  if (!input.value.trim()) return

  const newMessage = { question: input.value, answer: '...' }
  messages.push(newMessage)
  const messageIndex = messages.length - 1
  input.value = ''

  try {
    const response = await fetch(chatURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: newMessage.question })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += decoder.decode(value, { stream: true })
      messages[messageIndex].answer = result
    }
  } catch (error) {
    console.error('Error communicating with chat bot:', error)
    messages[messageIndex].answer = 'Error: ' + error.message
  }
}
</script>
<style scoped>
.el-container {
  height: 100%;
  width: 100%;
  background-color: #f3f5fc;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #f3f5fc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 55px;
}

.footer {
  background-color: #f3f5fc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15%;
  width: 100%;
  height: 80px;
  position: fixed;
  bottom: 0;
}

.main {
  background-color: #f3f5fc;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  margin-bottom: 80px;
}

.message-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  text-align: left;
}

.question,
.answer {
  margin-bottom: 5px;
  text-align: left;
}

.chatinput {
  padding: 10px;
}

.area {
  width: 600px;
  height: 36px;
  font-size: 16px;
  border: none;
  border-radius: 15px;
  padding: 10px;
  text-align: left;
}

:deep(.area::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.area::-webkit-scrollbar-thumb) {
  border-radius: 3px;
  background-color: #c3c3c3;
}

:deep(.area::-webkit-scrollbar-track) {
  background-color: transparent;
}

:deep(.el-button--large) {
  --el-button-size: 50px;
}
</style>
