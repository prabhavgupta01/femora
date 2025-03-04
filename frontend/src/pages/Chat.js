import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Luna, your AI health assistant. How can I help you today?",
      sender: 'ai'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, { text: newMessage, sender: 'user' }]);
    setNewMessage('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(newMessage);
      setMessages(prev => [...prev, { text: response.message, sender: 'ai' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble processing your request. Could you please try again?",
        sender: 'ai'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
      // Handle markdown headings (##, ###, etc.)
      if (line.match(/^#+\s/)) {
        const level = line.match(/^#+/)[0].length;
        const headingText = line.replace(/^#+\s/, '');
        return (
          <Typography key={index} variant="h6" sx={{ 
            mt: 2, 
            mb: 1, 
            fontWeight: 'bold',
            color: alpha(theme.palette.text.primary, 0.7),
            fontSize: level === 1 ? '1.2rem' : '1.1rem',
            letterSpacing: '0.3px'
          }}>
            {headingText}
          </Typography>
        );
      }
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <Typography key={index} sx={{ 
            ml: 2, 
            mb: 0.5,
            fontSize: '0.95rem',
            color: alpha(theme.palette.text.primary, 0.6),
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -16,
              top: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: alpha(theme.palette.text.primary, 0.4),
              transform: 'translateY(-50%)',
              boxShadow: `0 0 8px ${alpha(theme.palette.text.primary, 0.2)}`
            }
          }}>
            {line}
          </Typography>
        );
      }
      // Handle regular text
      return (
        <Typography key={index} sx={{ 
          mb: 1,
          fontSize: '0.95rem',
          color: alpha(theme.palette.text.primary, 0.6)
        }}>
          {line}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.primary.light, 0.1)})`,
      position: 'relative',
      overflow: 'hidden',
      '@keyframes float': {
        '0%': {
          transform: 'translateY(0px)'
        },
        '50%': {
          transform: 'translateY(-10px)'
        },
        '100%': {
          transform: 'translateY(0px)'
        }
      },
      '@keyframes glow': {
        '0%': {
          boxShadow: `0 0 20px ${alpha(theme.palette.secondary.main, 0.5)}`
        },
        '50%': {
          boxShadow: `0 0 30px ${alpha(theme.palette.secondary.main, 0.8)}, 0 0 50px ${alpha(theme.palette.primary.main, 0.3)}`
        },
        '100%': {
          boxShadow: `0 0 20px ${alpha(theme.palette.secondary.main, 0.5)}`
        }
      },
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1)',
          opacity: 1
        },
        '50%': {
          transform: 'scale(1.1)',
          opacity: 0.8
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 1
        }
      },
      '@keyframes rotate': {
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(360deg)'
        }
      },
      '@keyframes typing': {
        '0%': {
          transform: 'translateY(0)',
          opacity: 0.4
        },
        '50%': {
          transform: 'translateY(-4px)',
          opacity: 1
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 0.4
        }
      },
      '@keyframes shimmer': {
        '0%': {
          backgroundPosition: '-1000px 0'
        },
        '100%': {
          backgroundPosition: '1000px 0'
        }
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none'
      }
    }}>
      {/* Header */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        zIndex: 1,
        animation: isInputFocused ? 'none' : 'float 6s ease-in-out infinite'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          maxWidth: 1200,
          mx: 'auto'
        }}>
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{
              color: alpha(theme.palette.text.primary, 0.7),
              transition: 'all 0.3s ease',
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateX(-2px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar 
            sx={{ 
              width: 48,
              height: 48,
              bgcolor: 'transparent',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.6)})`,
                animation: isInputFocused ? 'none' : 'rotate 8s linear infinite',
                boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.6)})`,
                animation: isInputFocused ? 'none' : 'rotate 8s linear infinite reverse',
                opacity: 0.7
              }
            }}
          >
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.7)})`,
              animation: isInputFocused ? 'none' : 'pulse 3s ease-in-out infinite',
              boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.6)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '20%',
                height: '20%',
                borderRadius: '50%',
                background: alpha(theme.palette.common.white, 0.8),
                filter: 'blur(2px)',
                animation: isInputFocused ? 'none' : 'float 4s ease-in-out infinite'
              }
            }}>
              {/* Futuristic L */}
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: theme.palette.common.white,
                  textShadow: `0 0 15px ${alpha(theme.palette.common.white, 0.8)}`,
                  fontFamily: '"Orbitron", "Roboto", sans-serif',
                  letterSpacing: '2px',
                  animation: 'glow 2s ease-in-out infinite'
                }}
              >
                L
              </Typography>
            </Box>
          </Avatar>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Luna - Your AI Health Assistant
          </Typography>
        </Box>
      </Paper>

      {/* Chat Messages */}
      <List sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        maxWidth: 1200,
        mx: 'auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.3)
          }
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100%'
        }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <ListItem alignItems="flex-start" sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  mb: 2,
                  gap: 2,
                  '& .MuiListItemAvatar-root': {
                    minWidth: 'auto',
                    margin: 0
                  }
                }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        width: 40,
                        height: 40,
                        bgcolor: message.sender === 'user' ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                        boxShadow: `0 0 20px ${alpha(message.sender === 'user' ? theme.palette.primary.main : theme.palette.secondary.main, 0.5)}`,
                        border: message.sender === 'ai' ? `2px solid ${alpha(theme.palette.secondary.main, 0.3)}` : `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        animation: message.sender === 'ai' ? 'float 4s ease-in-out infinite' : 'none',
                        position: 'relative',
                        '&::before': message.sender === 'ai' ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '50%',
                          background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.6)})`,
                          animation: 'rotate 8s linear infinite',
                          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`
                        } : {},
                        '&::after': message.sender === 'ai' ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '50%',
                          background: `radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.6)})`,
                          animation: 'rotate 8s linear infinite reverse',
                          opacity: 0.7
                        } : {}
                      }}
                    >
                      {message.sender === 'user' ? (
                        <Box sx={{ 
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '60%',
                            height: '60%',
                            border: `2px solid ${theme.palette.primary.main}`,
                            transform: 'rotate(45deg)',
                            opacity: 0.8
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '40%',
                            height: '40%',
                            border: `2px solid ${theme.palette.primary.main}`,
                            transform: 'rotate(-45deg)',
                            opacity: 0.6
                          }
                        }} />
                      ) : (
                        <Box sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.7)})`,
                          animation: 'pulse 3s ease-in-out infinite',
                          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '20%',
                            left: '20%',
                            width: '20%',
                            height: '20%',
                            borderRadius: '50%',
                            background: alpha(theme.palette.common.white, 0.8),
                            filter: 'blur(2px)',
                            animation: 'float 4s ease-in-out infinite'
                          }
                        }}>
                          {/* Futuristic L */}
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: theme.palette.common.white,
                              textShadow: `0 0 15px ${alpha(theme.palette.common.white, 0.8)}`,
                              fontFamily: '"Orbitron", "Roboto", sans-serif',
                              letterSpacing: '2px',
                              animation: 'glow 2s ease-in-out infinite'
                            }}
                          >
                            L
                          </Typography>
                        </Box>
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={formatMessage(message.text)}
                    sx={{
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                      '& .MuiListItemText-primary': {
                        display: 'inline-block',
                        bgcolor: message.sender === 'user' 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.background.paper, 0.8),
                        p: 2,
                        borderRadius: 3,
                        maxWidth: '80%',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.15)}`
                        }
                      }
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              <ListItem alignItems="flex-start" sx={{
                gap: 2,
                '& .MuiListItemAvatar-root': {
                  minWidth: 'auto',
                  margin: 0
                }
              }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      width: 40,
                      height: 40,
                      bgcolor: 'transparent',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.6)})`,
                        animation: 'rotate 8s linear infinite',
                        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.6)})`,
                        animation: 'rotate 8s linear infinite reverse',
                        opacity: 0.7
                      }
                    }}
                  >
                    <Box sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.7)})`,
                      animation: 'pulse 3s ease-in-out infinite',
                      boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '20%',
                        left: '20%',
                        width: '20%',
                        height: '20%',
                        borderRadius: '50%',
                        background: alpha(theme.palette.common.white, 0.8),
                        filter: 'blur(2px)',
                        animation: 'float 4s ease-in-out infinite'
                      }
                    }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      p: 2,
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.5,
                        animation: 'typing 1.5s ease-in-out infinite'
                      }}>
                        <Box sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.text.primary, 0.4),
                          opacity: 0.4
                        }} />
                        <Box sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.text.primary, 0.4),
                          opacity: 0.4
                        }} />
                        <Box sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.text.primary, 0.4),
                          opacity: 0.4
                        }} />
                      </Box>
                      <Typography sx={{ 
                        color: alpha(theme.palette.text.primary, 0.6),
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}>
                        Luna is thinking...
                      </Typography>
                    </Box>
                  }
                  sx={{
                    '& .MuiListItemText-primary': {
                      display: 'inline-block',
                      maxWidth: '70%'
                    }
                  }}
                />
              </ListItem>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </List>

      {/* Input Area */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        zIndex: 1,
        animation: isInputFocused ? 'none' : 'float 6s ease-in-out infinite',
        animationDelay: '3s'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          maxWidth: 1200,
          mx: 'auto'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  },
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={!newMessage.trim() || loading}
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat; 