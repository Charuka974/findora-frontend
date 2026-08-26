import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Row,
  Col,
  Space,
  Card,
  Skeleton,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  HeartHandshake,
} from "lucide-react";
import { itemService } from "../../services/itemService";
import type { Item } from "../../types/item";
import ItemCard from "../../components/items/ItemCard";
// import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>("");

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setIsLoading(true);
        // Get newest open items (limited to 4)
        const items = await itemService.getItems({ status: "OPEN" });
        setRecentItems(items.slice(0, 4));
      } catch (err) {
        console.error("Failed to load recent items:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleSearchSubmit = () => {
    if (searchVal.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate("/items");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* 1. HERO SECTION WITH GRADIENT BACKGROUND */}
      <section
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%)",
          padding: "80px 24px",
          textAlign: "center",
          borderBottom: "1px solid #e6f7ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Space align="center" style={{ marginBottom: "16px" }}>
            <span
              style={{
                backgroundColor: "#e6f7ff",
                color: "#1890ff",
                padding: "4px 12px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid #91d5ff",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Sparkles size={13} />
              Reconnecting Belongs Instantly
            </span>
          </Space>

          <Title
            level={1}
            style={{
              fontSize: "44px",
              fontWeight: 800,
              color: "#002c8c",
              marginBottom: "16px",
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            Lost something? Found something?
          </Title>

          <Paragraph
            style={{
              fontSize: "18px",
              color: "#434343",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Findora is a smart, cloud-based platform built to help campus and
            local communities reconnect with their lost items quickly, securely,
            and stress-free.
          </Paragraph>

          {/* QUICK SEARCH INPUT */}
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto 40px auto",
              boxShadow: "0 8px 24px rgba(24, 144, 255, 0.1)",
              borderRadius: "50px",
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "2px solid #bae7ff",
              padding: "4px",
            }}
          >
            <Input
              size="large"
              placeholder="Search for lost phone, wallet, keys, ID card..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onPressEnter={handleSearchSubmit}
              prefix={
                <SearchIcon
                  size={18}
                  style={{ color: "#8c8c8c", marginLeft: "8px" }}
                />
              }
              suffix={
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={handleSearchSubmit}
                  style={{ fontWeight: 600, padding: "0 24px", height: "40px" }}
                >
                  Search
                </Button>
              }
              bordered={false}
              style={{ padding: "4px 8px" }}
            />
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Link to="/report/lost">
                <Button
                  type="primary"
                  danger
                  size="large"
                  shape="round"
                  icon={<PlusCircle size={18} style={{ marginRight: "6px" }} />}
                  style={{
                    minWidth: "180px",
                    height: "48px",
                    fontWeight: 600,
                    fontSize: "15px",
                    boxShadow: "0 4px 12px rgba(255, 77, 79, 0.2)",
                  }}
                >
                  Report Lost Item
                </Button>
              </Link>
            </Col>
            <Col>
              <Link to="/report/found">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<PlusCircle size={18} style={{ marginRight: "6px" }} />}
                  style={{
                    minWidth: "180px",
                    height: "48px",
                    fontWeight: 600,
                    fontSize: "15px",
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    boxShadow: "0 4px 12px rgba(82, 196, 26, 0.2)",
                  }}
                >
                  Report Found Item
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm="auto">
              <Link to="/items">
                <Button
                  type="default"
                  size="large"
                  shape="round"
                  icon={<ArrowRight size={18} style={{ marginLeft: "4px" }} />}
                  style={{
                    minWidth: "160px",
                    height: "48px",
                    fontWeight: 600,
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifySelf: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  Browse Items
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. RECENTLY REPORTED ITEMS */}
      <section
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
          }}
        >
          <div>
            <Title
              level={2}
              style={{ margin: 0, fontWeight: 700, color: "#1f1f1f" }}
            >
              Recently Reported
            </Title>
            <Paragraph style={{ color: "#595959", margin: "4px 0 0 0" }}>
              Latest items reported lost or found in the community.
            </Paragraph>
          </div>
          <Link
            to="/items"
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View All Items <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4].map((n) => (
              <Col key={n} xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: "12px" }}>
                  <Skeleton.Image
                    style={{
                      width: "100%",
                      height: "180px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                    active
                  />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : hasError ? (
          <ErrorState message="Could not fetch recently reported items. Make sure API Gateway is accessible or mock mode is toggled." />
        ) : recentItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#fafafa", borderRadius: "12px", border: "1px dashed #d9d9d9" }}>
            <Paragraph style={{ color: "#595959", fontSize: "16px", marginBottom: "20px" }}>
              No active items listed right now. Would you like to create a report?
            </Paragraph>
            <Space size="middle">
              <Button
                type="primary"
                danger
                shape="round"
                size="large"
                onClick={() => navigate("/report/lost")}
                style={{ fontWeight: 600 }}
              >
                Report Lost Item
              </Button>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={() => navigate("/report/found")}
                style={{ fontWeight: 600, backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Report Found Item
              </Button>
            </Space>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {recentItems.map((item) => (
              <Col key={item.id} xs={24} sm={12} lg={6}>
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* 3. HOW IT WORKS */}
      <section
        id="how"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "64px 24px",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <Title
            level={2}
            style={{ fontWeight: 700, color: "#1f1f1f", marginBottom: "8px" }}
          >
            How Findora Works
          </Title>
          <Paragraph
            style={{
              color: "#8c8c8c",
              maxWidth: "600px",
              margin: "0 auto 48px auto",
            }}
          >
            Reconnect with your items in three easy steps.
          </Paragraph>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: "#f5faff",
                  borderRadius: "16px",
                  height: "100%",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: "#e6f7ff",
                    color: "#1890ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px auto",
                  }}
                >
                  <PlusCircle size={28} />
                </div>
                <Title level={4}>1. Publish a Report</Title>
                <Paragraph style={{ color: "#595959", fontSize: "14px" }}>
                  Create a post detailing what you lost or found. Add
                  categories, location keywords, descriptions, and attach
                  images.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: "#f6ffed",
                  borderRadius: "16px",
                  height: "100%",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: "#f6ffed",
                    color: "#52c41a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px auto",
                  }}
                >
                  <SearchIcon size={28} />
                </div>
                <Title level={4}>2. Browse and Search</Title>
                <Paragraph style={{ color: "#595959", fontSize: "14px" }}>
                  Search through listings using filters for categories, status,
                  types, or location maps to easily match with corresponding
                  posts.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: "#fff0f6",
                  borderRadius: "16px",
                  height: "100%",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: "#fff0f6",
                    color: "#eb2f96",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px auto",
                  }}
                >
                  <HeartHandshake size={28} />
                </div>
                <Title level={4}>3. Reclaim & Resolve</Title>
                <Paragraph style={{ color: "#595959", fontSize: "14px" }}>
                  Contact listing owners directly using verified credentials,
                  arrange safe returns, and toggle item state to resolved.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 4. WHY CHOOSE FINDORA */}
      <section
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}
      >
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} md={12}>
            <div
              style={{
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                alt="Community connection and returning lost items"
                style={{ width: "100%", display: "block", borderRadius: "12px" }}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Title
                level={2}
                style={{
                  fontWeight: 800,
                  color: "#1f1f1f",
                  marginBottom: "24px",
                }}
              >
                A Trustworthy and Simple Network for Returns
              </Title>
              <Paragraph
                style={{
                  fontSize: "15px",
                  color: "#595959",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Traditional bulletin boards are messy and inefficient. Findora
                organizes lost and found data in a centralized database
                interface, making matching seamless.
              </Paragraph>

              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ color: "#1890ff", marginTop: "4px" }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      Secure and Verified Accounts
                    </Text>
                    <Paragraph
                      style={{
                        color: "#8c8c8c",
                        margin: "2px 0 0 0",
                        fontSize: "14px",
                      }}
                    >
                      Communication occurs only through registered accounts,
                      avoiding spammers and scrapers.
                    </Paragraph>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ color: "#52c41a", marginTop: "4px" }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      Real-time Notifications and Statuses
                    </Text>
                    <Paragraph
                      style={{
                        color: "#8c8c8c",
                        margin: "2px 0 0 0",
                        fontSize: "14px",
                      }}
                    >
                      Change listing status to "Resolved" to close postings once
                      the item is back with its owner.
                    </Paragraph>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ color: "#eb2f96", marginTop: "4px" }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      Community Centered
                    </Text>
                    <Paragraph
                      style={{
                        color: "#8c8c8c",
                        margin: "2px 0 0 0",
                        fontSize: "14px",
                      }}
                    >
                      Optimized layout options for universities, housing hubs,
                      campus blocks, or small towns.
                    </Paragraph>
                  </div>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section
        style={{
          background: "linear-gradient(135deg, #002240 0%, #001529 100%)",
          padding: "64px 24px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Title
            level={2}
            style={{ color: "#fff", fontWeight: 700, marginBottom: "16px" }}
          >
            Lost Something on Campus?
          </Title>
          <Paragraph
            style={{ color: "#a6adb4", fontSize: "16px", marginBottom: "32px" }}
          >
            Do not lose hope. Create a report, describe details, and leverage
            the eyes of your community. Findora is here to make returns happen.
          </Paragraph>
          <Space size="middle">
            <Link to="/report/lost">
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{ fontWeight: 600, padding: "0 28px", height: "46px" }}
              >
                Start Lost Report
              </Button>
            </Link>
            <Link to="/items">
              <Button
                ghost
                size="large"
                shape="round"
                style={{ fontWeight: 600, padding: "0 28px", height: "46px" }}
              >
                Browse Database
              </Button>
            </Link>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default Home;
