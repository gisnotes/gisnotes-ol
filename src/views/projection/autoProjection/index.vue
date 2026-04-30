<template>
  <div class="auto-projection">自动投影</div>
</template>

<script setup name="AutoProjection">
console.log("setup");

onBeforeMount(() => {
  console.log("onBeforeMount");
});

onActivated(() => {
  console.log("onActivated");
});

onMounted(() => {
  console.log("onMounted");
});

onDeactivated(() => {
  console.log("onDeactivated");
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
});

onUnmounted(() => {
  console.log("onUnmounted");
});
</script>
