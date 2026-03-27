import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 类型定义
interface InputData {
  emails: number;
  documents: number;
  meetings: number;
  searches: number;
  repetitive: number;
}

interface ResultData {
  annualSavings: number;
  mountain: string;
  savingsBreakdown: {
    emails: number;
    documents: number;
    meetings: number;
    searches: number;
    repetitive: number;
  };
  rewards: string[];
}

// 行业系数（假设值）
const industryCoefficients = {
  emails: 2, // 分钟/封
  documents: 30, // 分钟/份
  meetings: 60, // 分钟/场
  searches: 60, // 分钟/小时
  repetitive: 60, // 分钟/小时
};

// 山峰所需分钟
const mountainMinutes = {
  climbingGym: 2944,
  siguniang: 4424,
  everestBaseCamp: 8848,
  everest: 17696,
};

// 奖励等级
const rewardTiers = [
  "KIMI 30天会员",
  "凯乐石户外装备折扣券",
  "KIMI 年度会员 + 凯乐石登山包",
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [inputData, setInputData] = useState<InputData>({
    emails: 50,
    documents: 5,
    meetings: 5,
    searches: 5,
    repetitive: 5,
  });
  const [result, setResult] = useState<ResultData | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationStep, setCalculationStep] = useState<number>(0);
  const [countedSavings, setCountedSavings] = useState<number>(0);

  // 计算逻辑
  const calculateResults = () => {
    setIsCalculating(true);
    setCalculationStep(0);

    // 模拟计算过程
    const steps = [
      () => setCalculationStep(1),
      () => setCalculationStep(2),
      () => setCalculationStep(3),
      () => {
        const weeklySavings = {
          emails: inputData.emails * industryCoefficients.emails * 0.75,
          documents: inputData.documents * industryCoefficients.documents * 0.8,
          meetings: inputData.meetings * industryCoefficients.meetings * 0.85,
          searches: inputData.searches * industryCoefficients.searches * 0.65,
          repetitive: inputData.repetitive * industryCoefficients.repetitive * 0.9,
        };

        const totalWeeklySavings = Object.values(weeklySavings).reduce((sum, value) => sum + value, 0);
        const annualSavings = totalWeeklySavings * 48;

        let mountain = "攀岩馆";
        if (annualSavings >= mountainMinutes.everest) {
          mountain = "珠峰";
        } else if (annualSavings >= mountainMinutes.everestBaseCamp) {
          mountain = "珠峰大本营";
        } else if (annualSavings >= mountainMinutes.siguniang) {
          mountain = "四姑娘山";
        }

        const rewards = [];
        if (annualSavings >= mountainMinutes.climbingGym) rewards.push(rewardTiers[0]);
        if (annualSavings >= mountainMinutes.siguniang) rewards.push(rewardTiers[1]);
        if (annualSavings >= mountainMinutes.everestBaseCamp) rewards.push(rewardTiers[2]);

        const newResult: ResultData = {
          annualSavings,
          mountain,
          savingsBreakdown: weeklySavings,
          rewards,
        };

        setResult(newResult);
        setCountedSavings(0);
        setIsCalculating(false);
        setCurrentPage(3);
      },
    ];

    steps.forEach((step, index) => {
      setTimeout(step, index * 800);
    });
  };

  // 数字计数动画
  useEffect(() => {
    if (result && countedSavings < result.annualSavings) {
      const interval = setInterval(() => {
        setCountedSavings(prev => {
          const increment = result.annualSavings / 50;
          return Math.min(prev + increment, result.annualSavings);
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [result, countedSavings]);

  // 页面切换
  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // 滑块输入处理
  const handleInputChange = (key: keyof InputData, value: number) => {
    setInputData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KIMI × 凯乐石「8848分钟」时间赎回挑战',
        text: `我今年通过 KIMI 节省了 ${Math.round(result?.annualSavings || 0)} 分钟，相当于攀登${result?.mountain || ''}！`,
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="app" style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 科技与自然碰撞背景 */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
        zIndex: 0,
      }} />
      
      {/* KIMI 字母背景 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '20rem',
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.05)',
        zIndex: 0,
        pointerEvents: 'none',
        textShadow: '0 0 50px rgba(255, 255, 255, 0.1)',
      }}>KIMI</div>
      
      {/* 珠穆朗玛峰轮廓 */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '30%',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"1000\" height=\"300\" viewBox=\"0 0 1000 300\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 300 L100 280 L150 260 L200 240 L250 220 L300 200 L350 180 L400 160 L450 140 L500 120 L550 140 L600 160 L650 180 L700 200 L750 220 L800 240 L850 260 L900 280 L1000 300 Z\" fill=\"%231a1a1a\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-opacity=\"0.3\"/%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        zIndex: 0,
      }} />
      
      {/* 雾气效果 */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '40%',
        background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        zIndex: 0,
        animation: 'fog 20s infinite ease-in-out',
      }} />
      
      {/* 科技网格 */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")',
        zIndex: 0,
      }} />
      
      {/* 光晕效果 */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
      }} />

      <AnimatePresence mode="wait">
        {/* 落地页 */}
        {currentPage === 0 && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}>KIMI × 凯乐石</h2>
              <p style={{
                color: '#ffffff',
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 0 15px rgba(255,255,255,0.5)',
                fontFamily: 'Arial, sans-serif',
              }}>8848时间赎回挑战</p>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                lineHeight: '1.2',
              }}>你今年浪费在琐事上的时间</h1>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
              }}>够爬一次珠峰</h1>
              <p style={{
                fontSize: '1.2rem',
                color: '#cccccc',
                marginBottom: '3rem',
              }}>8848km = 珠穆朗玛峰海拔</p>
            </div>
            <button
              onClick={nextPage}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(255,255,255,0.5)',
              }}
            >
              开始测算
            </button>
          </motion.div>
        )}

        {/* 输入页 */}
        {currentPage === 1 && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>你的每周工作数据</h2>

            <div style={{ flex: 1 }}>
              {/* 邮件滑块 */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem' }}>邮件处理 (封)</label>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{inputData.emails}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={inputData.emails}
                  onChange={(e) => handleInputChange('emails', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#333333',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />
              </div>

              {/* 文档滑块 */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem' }}>文档处理 (份)</label>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{inputData.documents}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={inputData.documents}
                  onChange={(e) => handleInputChange('documents', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#333333',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />
              </div>

              {/* 会议滑块 */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem' }}>会议时长 (场)</label>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{inputData.meetings}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={inputData.meetings}
                  onChange={(e) => handleInputChange('meetings', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#333333',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />
              </div>

              {/* 搜索滑块 */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem' }}>信息搜索 (小时)</label>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{inputData.searches}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={inputData.searches}
                  onChange={(e) => handleInputChange('searches', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#333333',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />
              </div>

              {/* 重复工作滑块 */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem' }}>重复工作 (小时)</label>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{inputData.repetitive}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={inputData.repetitive}
                  onChange={(e) => handleInputChange('repetitive', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#333333',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
            </div>

            <button
              onClick={calculateResults}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                boxShadow: '0 0 15px rgba(255,255,255,0.5)',
              }}
            >
              查看我的时间负债
            </button>
          </motion.div>
        )}

        {/* 计算页 */}
        {currentPage === 2 && isCalculating && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
              }}>正在计算你的时间价值...</h2>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '3px solid #333333',
                  borderTop: '3px solid #e94560',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>

              <div style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
                <div style={{
                  marginBottom: '1rem',
                  opacity: calculationStep >= 1 ? 1 : 0.5,
                  color: calculationStep >= 1 ? '#ffffff' : '#cccccc',
                }}>• 分析你的工作数据</div>
                <div style={{
                  marginBottom: '1rem',
                  opacity: calculationStep >= 2 ? 1 : 0.5,
                  color: calculationStep >= 2 ? '#ffffff' : '#cccccc',
                }}>• 计算时间节省量</div>
                <div style={{
                  marginBottom: '1rem',
                  opacity: calculationStep >= 3 ? 1 : 0.5,
                  color: calculationStep >= 3 ? '#ffffff' : '#cccccc',
                }}>• 换算成山峰高度</div>
                <div style={{
                  marginBottom: '1rem',
                  opacity: calculationStep >= 4 ? 1 : 0.5,
                  color: calculationStep >= 4 ? '#ffffff' : '#cccccc',
                }}>• 生成个性化报告</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 结果页 */}
        {currentPage === 3 && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>你的时间赎回报告</h2>

            {/* 年节省分钟数 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}>
              <p style={{ color: '#cccccc', marginBottom: '0.5rem' }}>你每年可节省</p>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                textShadow: '0 0 15px rgba(255,255,255,0.5)',
              }}>{Math.round(countedSavings)}</h1>
              <p style={{ color: '#cccccc' }}>分钟</p>
            </div>

            {/* 山峰换算 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
            }}>
              <p style={{ marginBottom: '0.5rem' }}>相当于攀登</p>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffffff',
                textShadow: '0 0 15px rgba(255,255,255,0.5)',
              }}>{result.mountain}</h2>
            </div>

            {/* 时间分布条形图 */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>时间节省分布</h3>
              {Object.entries(result.savingsBreakdown).map(([key, value]) => {
                const labels = {
                  emails: '邮件处理',
                  documents: '文档处理',
                  meetings: '会议时长',
                  searches: '信息搜索',
                  repetitive: '重复工作',
                };
                const percentage = (value / Object.values(result.savingsBreakdown).reduce((sum, v) => sum + v, 0)) * 100;
                
                return (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{labels[key as keyof typeof labels]}</span>
                      <span>{Math.round(value)}分钟</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#333333',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 奖励预览 */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>你的专属奖励</h3>
              {result.rewards.length > 0 ? (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '1rem' }}>
                  {result.rewards.map((reward, index) => (
                    <div key={index} style={{
                    marginBottom: index < result.rewards.length - 1 ? '0.5rem' : 0,
                    padding: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    borderLeft: '3px solid #ffffff',
                  }}>
                      {reward}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#cccccc' }}>继续优化工作效率，解锁更多奖励</p>
              )}
            </div>

            {/* 分享按钮 */}
            <button
              onClick={handleShare}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '50px',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                marginBottom: '1rem',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              分享我的成就
            </button>

            {/* 重新测算按钮 */}
            <button
              onClick={() => setCurrentPage(1)}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '50px',
                padding: '1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              重新测算
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全局样式 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fog {
          0% { opacity: 0.3; transform: translateX(-10%); }
          50% { opacity: 0.6; transform: translateX(10%); }
          100% { opacity: 0.3; transform: translateX(-10%); }
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #0a0a0a;
          color: #ffffff;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  );
};

export default App;