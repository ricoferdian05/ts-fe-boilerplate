<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { emailValidator, requiredValidator } from '@validators'

import { VForm } from 'vuetify/components'
import type { LoginResponse } from '@/@fake-db/types'

import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import axios from 'axios'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const refVForm = ref<VForm>()
const email = ref('john@gmail.com')
const password = ref('123qwe123QWE!')
const rememberMe = ref(false)

const login = () => { 
  axios.post<LoginResponse>(
    'http://localhost:5050/v1/login',
    { email: email.value, password: password.value}
  )
  .then((r => {
    const response = r.data

    localStorage.setItem('accessToken', JSON.stringify(response.data.token))
    localStorage.setItem('role', JSON.stringify(response.data.role))
    localStorage.setItem('email', JSON.stringify(response.data.email))
    localStorage.setItem('id', JSON.stringify(response.data.id))
    localStorage.setItem('accessType', JSON.stringify(response.data.internal.responsibility.accessTypes))
    localStorage.setItem('userData', JSON.stringify(response.data))

    router.replace(route.query.to ? String(route.query.to) : '/')
  }))
  .catch(e => {
    const { errors: formErrors } = e.response.data

    errors.value = formErrors
    console.error(e.response.data)
  })
}

const onSubmit = () => {
  refVForm.value?.validate()
  .then(({ valid: isValid}) => {
    if (isValid) {
      login()
    }
  })
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm
          ref="refVForm"
          @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
