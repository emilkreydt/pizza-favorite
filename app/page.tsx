'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Radio, Button, Typography, message, Spin, Result } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

const { Title } = Typography;

interface PizzaFormValues {
  email: string;
  geboorteDatum: string;
  smaak: string;
  kaas: string;
  vlees: string;
  groente: string;
}

export default function PizzaQuizForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // Initial load simulation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted) {
      const resetTimer = setTimeout(() => {
        setSubmitted(false);
      }, 3000); // Show success screen for 3 seconds
      return () => clearTimeout(resetTimer);
    }
  }, [submitted]);

  const handleFinish = async (values: PizzaFormValues) => {
    setLoading(true);
    try {
      const res = await fetch('/api/pizza/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success('Je pizza-resultaat is verzonden naar je e-mail!');
        setSubmitted(true);
        form.resetFields();
      } else {
        message.error('Er is iets misgegaan met verzenden.');
      }
    } catch (err) {
      message.error('Fout bij verzenden van formulier. ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {initialLoading ? (
        <div className="text-center py-32">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 16 }}>Pizza quiz wordt geladen...</p>
        </div>
      ) : (
        <>
          <Title level={2}>Wat voor pizza ben jij?</Title>

          {loading ? (
            <div className="text-center py-12">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
              <p style={{ marginTop: 16 }}>Verwerken van je pizza-resultaat...</p>
            </div>
          ) : submitted ? (
            <Result
              icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
              title="Je pizza-resultaat is verzonden!"
              subTitle="Je kunt nu het formulier opnieuw invullen."
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{}}
            >
              <Form.Item
                label="E-mailadres"
                name="email"
                rules={[{ required: true, message: 'Voer je e-mailadres in' }]}
              >
                <Input type="email" />
              </Form.Item>

              <Form.Item
                label="Geboortedatum"
                name="geboorteDatum"
                rules={[{ required: true, message: 'Voer je geboortedatum in' }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item
                label="Welke smaak spreekt je het meeste aan?"
                name="smaak"
                rules={[{ required: true, message: 'Kies een optie' }]}
              >
                <Radio.Group>
                  <Radio value="Zout">Zout</Radio>
                  <Radio value="Zoet">Zoet</Radio>
                  <Radio value="Rokerig">Rokerig</Radio>
                  <Radio value="Pittig">Pittig</Radio>
                  <Radio value="Fris">Fris</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Hoeveel kaas wil je?"
                name="kaas"
                rules={[{ required: true, message: 'Kies een optie' }]}
              >
                <Radio.Group>
                  <Radio value="Heel veel">Heel veel</Radio>
                  <Radio value="Normaal">Normaal</Radio>
                  <Radio value="Weinig">Weinig</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Wil je vlees op je pizza?"
                name="vlees"
                rules={[{ required: true, message: 'Kies een optie' }]}
              >
                <Radio.Group>
                  <Radio value="Ja, kip">Ja, kip</Radio>
                  <Radio value="Ja, pepperoni">Ja, pepperoni</Radio>
                  <Radio value="Alleen spek">Alleen spek</Radio>
                  <Radio value="Nee">Nee</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Welke groente vind je lekker?"
                name="groente"
                rules={[{ required: true, message: 'Kies een optie' }]}
              >
                <Radio.Group>
                  <Radio value="Ananas">Ananas</Radio>
                  <Radio value="Paprika">Paprika</Radio>
                  <Radio value="Tomaat">Tomaat</Radio>
                  <Radio value="Ui">Ui</Radio>
                  <Radio value="Geen">Geen</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Verstuur
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </div>
  );
}
