<template>
  <div>
    <router-view name="header"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

* {
  box-sizing: border-box;
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  color: #999999;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100%;
  background: #222222;
}

strong {
  color: inherit;
  font-weight: 500;
}

label {
  color: #AAAAAA;
}

input, button, select, option {
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
}

select:focus {
  border-radius: 4px 4px 0 0;
}

input:focus, button:focus, select:focus {
  border: 1px solid #FFFFFFAA;
}

input[type=text], input[type=number], select {
  color: #999999;
  background: #111111;
}

option[disabled] {
  color: #494949;
  background: #090909;
}

button, input[type=submit] {
  color: #AAAAAA;
  background: #555555;
  cursor: pointer;
}

button:not([disabled]):hover, input[type=submit]:not([disabled]):hover {
  color: #CCCCCC;
  background: #666666;
}

button[disabled], input[disabled] {
  opacity: 50%;
  cursor: not-allowed;
}

input.error, button.error {
  border: 1px solid #FF2222;
}

.error-message {
  margin-top: 12px;
  color: #FF2222;
  font-size: 14px;
}

.buttons {
  width: 100px;
  margin: auto;
  margin-bottom: 32px;

  button, a {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    padding: 0;
    font-size: 24px;
    text-align: center;
    background: #191919;
    border: 1px solid transparent;
    box-shadow: 0px 0px 4px #FFFFFF11;
    border-radius: 4px;
    i { color: #666666; }
  }

  button:hover, a:hover {
    background: #1F1F1F;
    i { color: #777777; }
  }

  button:focus, a:focus {
    border: 1px solid #FFFFFFAA;
  }
}
</style>
