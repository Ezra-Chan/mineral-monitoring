<template>
  <el-form v-bind="form" :model="modelValue" ref="formRef">
    <el-collapse v-if="form.group" v-model="activeNames">
      <el-collapse-item
        v-for="group in columns"
        :key="group.title"
        :title="group.title"
        :name="group.title"
      >
        <template v-for="item in group.children" :key="item.prop">
          <el-form-item v-bind="item.formItem">
            <component
              :is="item.component"
              v-bind="item.attrs"
              v-model="modelValue[item.formItem.prop]"
            >
              <template v-if="item.children" v-for="(child, index) in item.children" :key="index">
                <component :is="child.component" v-bind="child.attrs" />
              </template>
            </component>
          </el-form-item>
        </template>
      </el-collapse-item>
    </el-collapse>
    <template v-else v-for="item in columns" :key="item.prop">
      <el-form-item v-bind="item.formItem">
        <component
          :is="item.component"
          v-bind="item.attrs"
          v-model="modelValue[item.formItem.prop]"
        >
          <template v-if="item.children" v-for="(child, index) in item.children" :key="index">
            <component :is="child.component" v-bind="child.attrs" />
          </template>
        </component>
      </el-form-item>
    </template>
    <el-form-item>
      <slot name="operation"></slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const formRef = $ref();
let activeNames = $ref([]);
const instance = getCurrentInstance();

onMounted(() => {
  const { form } = props;
  if (form.group) {
    if (form.defaultExpandAll) {
      activeNames = props.columns.map(i => i.title);
    } else if (form.expandItem) {
      activeNames = form.expandItem;
    }
  }
  const entries = Object.entries(formRef.$.exposed);
  for (const [key, value] of entries) {
    instance.exposed[key] = value;
  }
});

defineExpose({ ...instance.exposed });
</script>
