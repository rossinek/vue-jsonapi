<template>
  <div>
    <p
      v-for="query of Object.keys($jsonapi.queries)"
      :key="query"
      :data-spec="query"
    >
      Query "{{ query }}" status:
      <span data-spec="status">{{ $jsonapi.queries[query].info.status }}</span>
      <span
        v-if="$jsonapi.queries[query].loading"
        data-spec="loading"
      >
        (is loading)
      </span>
    </p>
    <p
      v-if="handlerMessage"
      class="error"
      data-spec="message-from-handler"
      v-text="handlerMessage"
    />
    <button @click="callEndpoint">
      click here to get another error
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      idle: null,
      unsuccessful: null,
      unsuccessfulWithHandler: null,
      successful: null,
      handlerMessage: '',
    }
  },
  jsonapi: {
    // error is ignored
    idle: {
      fetchPolicy: 'cache-only',
      config: {
        method: 'get',
        url: '/ignored-not-existing-endpoint',
      },
    },
    // error is ignored
    unsuccessful: {
      config: {
        method: 'get',
        url: '/not-existing-endpoint',
      },
    },
    unsuccessfulWithHandler: {
      config: {
        method: 'get',
        url: '/another-not-existing-endpoint',
      },
      error (error) {
        this.handlerMessage = `Message from handler: response status was ${error.response.status}`
      },
    },
    successful: {
      config: {
        method: 'get',
        url: '/tasks/1',
      },
    },
  },
  methods: {
    async callEndpoint () {
      try {
        await this.$jsonapi.request({
          config: {
            method: 'post',
            url: '/yet-another-not-existing-endpoint',
          },
        })
      } catch (error) {
        alert('This endpoint does not exist too :(')
      }
    },
  },
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
