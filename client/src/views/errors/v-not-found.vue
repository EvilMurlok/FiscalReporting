<template>
  <!-- Page Content -->
  <div class="hero">
    <div class="hero-inner text-center">
      <div class="bg-white overflow-hidden">
        <div class="content content-full">
          <div class="py-4">
            <!-- Error Header -->
            <h1 class="display-1 font-w600 text-city">404</h1>
            <h2 class="h4 font-w400 text-muted mb-5">Страница, которую Вы искали, не была найдена! :-(</h2>
            <!-- END Error Header -->

          </div>
        </div>
      </div>
      <div class="content content-full text-muted">
        <!-- Error Footer -->
        Вернуться на страницу
        <router-link to="/retrieve-user/" class="link-fx">
          мой профиль
        </router-link>
        <!-- END Error Footer -->
      </div>
    </div>
  </div>
  <!-- END Page Content -->
</template>

<script>
export default {
  name: "v-not-found"
}
</script>