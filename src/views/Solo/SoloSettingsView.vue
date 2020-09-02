<template>
  <div id="wrapper">
    <form>
      <div>
        <label for="language">Language</label>
        <select id="language" v-model="language">
          <option v-for="lang in availableLanguages"
                  :key="lang"
                  :value="lang">{{ lang }}</option>
        </select>
      </div>
      <div>
        <label for="mode">Mode</label>
        <select id="mode" v-model="mode">
          <option v-for="[mode, disabled] in availableModes"
                  :key="mode"
                  :value="mode"
                  :disabled="disabled">{{ mode }}</option>
        </select>
      </div>
      <div>
        <template v-if="mode === 'words'">
          <label for="count">Count</label>
          <input v-model="count" type="number" autocomplete="off" :class="{ error: this.hasError }">
        </template>
        <template v-else-if="mode === 'time'">
          <label for="time">Time (sec)</label>
          <input v-model="time" type="number" autocomplete="off" :class="{ error: this.hasError }">
        </template>
      </div>
      <div v-if="this.hasError" class="error-message">{{ this.error }}</div>
      <div>
        <input @click.prevent="onSubmit" type="submit" value="Type!">
      </div>
    </form>
  </div>
</template>

<script>
import Words from '/modules/words';

export default {
  name: 'SoloSettingsView',
  data: function() {
    return {
      language: 'english',
      availableModes: [ ['words', false], ['time', true] ],
      mode: 'words',
      count: 100,
      time: 60,
      error: null
    }
  },
  watch: {
    count: function(newValue, oldValue) {
      this.error = null;
      if (newValue <= 0) this.error = 'Count must be greater than 0';
    },
    time: function(newValue, oldValue) {
      this.error = null;
      if (newValue <= 0) this.error = 'Time must be greater than 0';
    }
  },
  computed: {
    hasError: function() { return !!this.error; },
    availableLanguages: function() { return Object.keys(Words); }
  },
  methods: {
    onSubmit: function(e) {
      if (this.hasError) return;
      const params = { lang: this.language, mode: this.mode };

      switch (this.mode) {
        case 'words': params.count = this.count; break;
        case 'time': params.time = this.time; break;
      }

      this.$router.push({ name: 'solo-game', query: params });
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  width: 360px;
  margin: auto;
  margin-top: 280px;

  form {
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    div + div {
      margin-top: 32px;
    }

    label {
      margin-right: 32px;
    }

    select, option {
      text-transform: capitalize;
    }

    input, select, option {
      width: 160px;
    }

    input[type=submit] {
      width: 100%;
    }
  }
}
</style>
