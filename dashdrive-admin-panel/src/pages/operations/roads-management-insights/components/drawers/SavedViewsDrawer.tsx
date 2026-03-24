// src/pages/operations/roads-management-insights/components/drawers/SavedViewsDrawer.tsx

import React, { useMemo, useState } from 'react';
import {
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import type { RoadsFilters, RoadsMapLayers, SavedViewItem } from '../../types/roadsInsights.types';

const { Text } = Typography;

export interface SavedViewsDrawerProps {
  open: boolean;
  onClose: () => void;
  items: SavedViewItem[];
  loading?: boolean;
  currentFilters: RoadsFilters;
  currentLayers: RoadsMapLayers;
  onApply: (item: SavedViewItem) => void;
  onCreate: (payload: Omit<SavedViewItem, 'id'>) => Promise<void>;
  onUpdate: (id: string, payload: Partial<Omit<SavedViewItem, 'id'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface CreateViewFormValues {
  name: string;
  description?: string;
}

interface RenameViewFormValues {
  name: string;
}

const compactFilters = (filters: RoadsFilters) => {
  const tags: string[] = [];
  if (filters.mode) tags.push(`Mode: ${filters.mode}`);
  if (filters.cityId) tags.push(`City: ${filters.cityId}`);
  if (filters.zoneId) tags.push(`Zone: ${filters.zoneId}`);
  if (filters.serviceType?.length) tags.push(`Services: ${filters.serviceType.length}`);
  if (filters.roadType?.length) tags.push(`Road Types: ${filters.roadType.length}`);
  return tags;
};

const enabledLayers = (layers: RoadsMapLayers) =>
  Object.entries(layers)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

const SavedViewsDrawer: React.FC<SavedViewsDrawerProps> = ({
  open,
  onClose,
  items,
  loading = false,
  currentFilters,
  currentLayers,
  onApply,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [createForm] = Form.useForm<CreateViewFormValues>();
  const [renameForm] = Form.useForm<RenameViewFormValues>();

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<SavedViewItem | null>(null);

  const currentLayerTags = useMemo(() => enabledLayers(currentLayers), [currentLayers]);

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    setSubmitting(true);
    try {
      await onCreate({
        name: values.name,
        description: values.description,
        filters: currentFilters,
        layers: currentLayers,
      });
      createForm.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  const openRenameModal = (item: SavedViewItem) => {
    setRenameTarget(item);
    renameForm.setFieldsValue({ name: item.name });
    setRenameOpen(true);
  };

  const handleRename = async () => {
    if (!renameTarget) return;

    const values = await renameForm.validateFields();
    const nextName = values.name.trim();
    if (!nextName || nextName === renameTarget.name) {
      setRenameOpen(false);
      return;
    }

    setEditingId(renameTarget.id);
    try {
      await onUpdate(renameTarget.id, { name: nextName });
      setRenameOpen(false);
      setRenameTarget(null);
      renameForm.resetFields();
    } finally {
      setEditingId(null);
    }
  };

  return (
    <>
      <Drawer
        title="Saved Views"
        open={open}
        onClose={onClose}
        size={440}
        destroyOnHidden={false}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text strong>Save current configuration</Text>
            <div style={{ marginTop: 8, marginBottom: 12 }}>
              <Space wrap>
                {compactFilters(currentFilters).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
                {currentLayerTags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>

            <Form form={createForm} layout="vertical">
              <Form.Item
                name="name"
                label="View name"
                rules={[{ required: true, message: 'Please enter a view name' }]}
              >
                <Input placeholder="e.g. Live Congestion Monitor" />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea
                  rows={3}
                  placeholder="Short description for this preset"
                />
              </Form.Item>

              <Button type="primary" onClick={handleCreate} loading={submitting}>
                Save Current View
              </Button>
            </Form>
          </div>

          <div>
            <Text strong>Saved views</Text>
          </div>

          {loading ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <Spin />
            </div>
          ) : items.length === 0 ? (
            <Empty description="No saved views yet" />
          ) : (
            <List
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="apply" type="link" onClick={() => onApply(item)}>
                      Apply
                    </Button>,
                    <Button
                      key="rename"
                      type="link"
                      loading={editingId === item.id}
                      onClick={() => openRenameModal(item)}
                    >
                      Rename
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Delete saved view?"
                      onConfirm={() => onDelete(item.id)}
                    >
                      <Button type="link" danger>
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={
                      <Space orientation="vertical" size={6}>
                        {item.description ? <Text type="secondary">{item.description}</Text> : null}
                        <Space wrap>
                          {compactFilters(item.filters).map((tag) => (
                            <Tag key={`${item.id}-${tag}`}>{tag}</Tag>
                          ))}
                        </Space>
                        <Space wrap>
                          {enabledLayers(item.layers).map((tag) => (
                            <Tag key={`${item.id}-layer-${tag}`} color="blue">
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Space>
      </Drawer>

      <Modal
        title="Rename saved view"
        open={renameOpen}
        onCancel={() => {
          setRenameOpen(false);
          setRenameTarget(null);
          renameForm.resetFields();
        }}
        onOk={handleRename}
        confirmLoading={Boolean(editingId)}
        destroyOnHidden
      >
        <Form form={renameForm} layout="vertical">
          <Form.Item
            name="name"
            label="View name"
            rules={[
              { required: true, message: 'Please enter a new name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Enter new view name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SavedViewsDrawer;
