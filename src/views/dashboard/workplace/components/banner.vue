<template>
  <a-col class="banner">
    <a-space direction="vertical" size="large" :style="{ width: '1000px' }">
      <a-form :model="addPluginAuthorisationData" :layout="layout">
        <a-form-item field="plugin" label="插件名">
          <a-input
            v-model="addPluginAuthorisationData.plugin"
            placeholder="请输入插件名字"
          />
        </a-form-item>
        <a-form-item field="username" label="用户QQ">
          <a-input
            v-model="addPluginAuthorisationData.username"
            placeholder="请输入用户QQ"
          />
        </a-form-item>
        <a-form-item>
          <a-button @click="onInsertAuthorisation" long :loading="loading"
            >添加授权</a-button
          >
        </a-form-item>
      </a-form>
    </a-space>
    <a-divider />
    <a-space direction="vertical" size="large" :style="{ width: '1000px' }">
      <a-form :model="delPluginAuthorisationData" :layout="layout">
        <a-form-item field="plugin" label="插件名">
          <a-input
            v-model="delPluginAuthorisationData.plugin"
            placeholder="请输入插件名字"
          />
        </a-form-item>
        <a-form-item field="username" label="用户QQ">
          <a-input
            v-model="delPluginAuthorisationData.username"
            placeholder="请输入用户QQ"
          />
        </a-form-item>
        <a-form-item>
          <a-button @click="onDeleteAuthorisation" long :loading="loading"
            >删除授权</a-button
          >
        </a-form-item>
      </a-form>
    </a-space>
    <a-divider />
    <a-table
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :bordered="false"
      :size="size"
      column-resizable
      :sticky-header="100"
      @page-change="onPageChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
      <template #operations>
        <a-button type="dashed" status="success" size="small">
          {{ $t('searchTable.columns.operations.update') }}
        </a-button>
        <a-button type="dashed" status="danger" size="small">
          {{ $t('searchTable.columns.operations.delete') }}
        </a-button>
      </template>
    </a-table>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, h } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryPolicyList, PolicyRecord, PolicyParams } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import {
    PluginAuthorisationData,
    addAuthorisation,
    delAuthorisation,
  } from '@/api/form';
  import { Message } from '@arco-design/web-vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const layout = ref('inline');
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
  const addPluginAuthorisationData = ref<PluginAuthorisationData>({
    plugin: '',
    username: '',
  });
  const delPluginAuthorisationData = ref<PluginAuthorisationData>({
    plugin: '',
    username: '',
  });
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'id',
      slotName: 'index',
      width: 100,
    },
    {
      title: t('searchTable.columns.plugin'),
      dataIndex: 'plugin',
      filterable: {
        filter: (value, record) => record.name.includes(value),
        slotName: 'name-filter',
        icon: () => h(IconSearch),
      },
      width: 200,
    },
    {
      title: t('searchTable.columns.username'),
      dataIndex: 'username',
      sortable: {
        sortDirections: ['ascend'],
      },
      width: 200,
    },
    {
      title: t('searchTable.columns.token'),
      dataIndex: 'token',
    },
  ]);

  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPolicyList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  const onInsertAuthorisation = async () => {
    setLoading(true);
    try {
      await addAuthorisation(addPluginAuthorisationData.value);
      Message.success('添加授权成功');
      addPluginAuthorisationData.value.plugin = '';
      addPluginAuthorisationData.value.username = '';
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const onDeleteAuthorisation = async () => {
    setLoading(true);
    try {
      await delAuthorisation(delPluginAuthorisationData.value);
      Message.success('删除授权成功');
      delPluginAuthorisationData.value.plugin = '';
      delPluginAuthorisationData.value.username = '';
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
