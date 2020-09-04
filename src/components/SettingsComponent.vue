<template>
  <div id="wrapper">
    <form>
      <div>
        <label>Language</label>
        <select v-model="language">
          <option v-for="lang in availableLanguages"
                  :key="lang"
                  :value="lang">{{ lang }}</option>
        </select>
      </div>
      <div>
        <label>Mode</label>
        <select v-model="mode">
          <option v-for="[mode, disabled] in availableModes"
                  :key="mode"
                  :value="mode"
                  :disabled="disabled">{{ mode }}</option>
        </select>
      </div>
      <div>
        <template v-if="mode === 'words'">
          <label>Words</label>
          <input v-model="wordCount" type="number" autocomplete="off" :class="{ error: this.hasModeError }">
        </template>
        <template v-else-if="mode === 'time'">
          <label>Time (sec)</label>
          <input v-model="time" type="number" autocomplete="off" :class="{ error: this.hasModeError }">
        </template>
      </div>
      <div v-if="this.hasModeError" class="error-message">{{ this.modeError }}</div>
      <template v-if="multi">
        <div>
          <label>Multiplayer Mode</label>
          <select v-model="multiMode">
            <option v-for="[multiMode, disabled] in availableMultiModes"
                    :key="multiMode"
                    :value="multiMode"
                    :disabled="disabled">{{ multiMode }}</option>
          </select>
        </div>
        <div>
          <template v-if="multiMode === 'rounds'">
            <label>Rounds</label>
            <input v-model="roundCount" type="number" autocomplete="off" :class="{ error: this.hasMultiModeError }">
          </template>
          <template v-else-if="multiMode === 'timeAttack'">
            <label>Time Attack (sec)</label>
            <input v-model="timeAttack" type="number" autocomplete="off" :class="{ error: this.hasMultiModeError }">
          </template>
        </div>
        <div v-if="this.hasMultiModeError" class="error-message">{{ this.multiModeError }}</div>
        <div>
          <label class="radioButton-span">Public
            <input type="radio" name="public" :checked="publicRoom">
            <span class="radioButton"></span>
          </label>
          <label class="radioButton-span">Private
            <input type="radio" name="public" :checked="!publicRoom">
            <span class="radioButton"></span>
          </label>
        </div>
        <div>
          <label>MaxPlayersCount</label>
          <input v-model="maxPlayerCount" type="number" autocomplete="off" :class="{ error: this.hasMaxPlayersCountError }">
        </div>
        <div v-if="this.hasMaxPlayersCountError" class="error-message">{{ this.maxPlayerCountError }}</div>
      </template>
      <div>
        <input @click.prevent="onSubmit" type="submit" :value="multi ? 'Create Room' : 'Type!'">
      </div>
    </form>
  </div>
</template>

<script>
import Words from '/modules/words';

export default {
  name: 'SettingsComponent',
  props: {
    multi: Boolean
  },
  data: function() {
    return {
      language: 'english',
      availableModes: [ ['words', false], ['time', true] ],
      availableMultiModes: [ ['rounds', false], ['timeAttack', true] ],
      mode: 'words',
      multiMode: 'rounds',
      wordCount: 100, // mode = words
      time: 60, // mode = time
      roundCount: 1, // multiMode = rounds
      timeAttack: 300, // multiMode = timeAttack
      publicRoom: true,
      maxPlayerCount: 8,
      modeError: null,
      multiModeError: null
    }
  },
  watch: {
    wordCount: function(newValue, oldValue) {
      this.modeError = null;
      if (newValue <= 0) this.modeError = 'Word count must be greater than 0';
    },
    time: function(newValue, oldValue) {
      this.modeError = null;
      if (newValue <= 0) this.modeError = 'Time must be greater than 0';
    },
    roundCount: function(newValue, oldValue) {
      this.multiModeError = null;
      if (newValue <= 0) this.multiModeError = 'Round count must be greater than 0';
    },
    timeAttack: function(newValue, oldValue) {
      this.multiModeError = null;
      if (newValue <= 0) this.multiModeError = 'Time Attack must be greater than 0';
    },
    maxPlayerCount: function(newValue, oldValue) {
      this.maxPlayerCountError = null;
      if (newValue <= 0) this.maxPlayerCountError = 'Player count must be greater than 0';
    },
  },
  computed: {
    hasModeError: function() { return !!this.modeError; },
    hasMultiModeError: function() { return !!this.multiModeError; },
    hasMaxPlayersCountError: function() { return !!this.maxPlayerCountError; },
    availableLanguages: function() { return Object.keys(Words); }
  },
  methods: {
    onSubmit: function(e) {
      if (this.hasModeError || this.hasMultiModeError) return;
      const params = { lang: this.language, mode: this.mode };

      switch (this.mode) {
        case 'words': params.wordCount = this.wordCount; break;
        case 'time': params.time = this.time; break;
      }

      if (this.multi) {
        params.multiMode = this.multiMode;
        switch (this.multiMode) {
          case 'rounds': params.roundCount = this.roundCount; break;
          case 'timeAttack': params.timeAttack = this.timeAttack; break;
        }
        params.publicRoom = this.publicRoom;
        params.maxPlayerCount = this.maxPlayerCount;
      }

      this.$emit('submit', params);
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  margin: auto;
  margin-top: 64px;

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
