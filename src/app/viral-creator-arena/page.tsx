
'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function ViralCreatorArenaPage() {
    const boostModalRef = useRef<HTMLDivElement>(null);
    const boostButtonRef = useRef(null);

    const likeVideo = (btn: HTMLButtonElement) => {
        btn.style.transform = "scale(1.3)";
        setTimeout(() => {
            if (btn) {
                btn.style.transform = "scale(1)";
            }
        }, 200);
    };

    const shareVideo = () => {
        if (navigator.share) {
            navigator.share({ title: "Viral Creator Arena", url: window.location.href });
        } else {
            alert("Copy the link: " + window.location.href);
        }
    };

    const openBoost = () => {
        if (boostModalRef.current) {
            boostModalRef.current.style.display = "block";
        }
    };

    const closeBoost = () => {
        if (boostModalRef.current) {
            boostModalRef.current.style.display = "none";
        }
    };
    
    useEffect(() => {
        const videos = document.querySelectorAll<HTMLVideoElement>('.video-card video');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });

        videos.forEach(video => {
            observer.observe(video);
        });

        return () => {
            videos.forEach(video => {
                observer.unobserve(video);
            });
        };
    }, []);


    return (
        <>
            <style jsx global>{`
                body, html {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    background: #000;
                    color: #fff;
                    overflow-x: hidden;
                }
                .topbar {
                    width: 100%;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #000;
                    position: fixed;
                    z-index: 1000;
                    top: 0;
                    border-bottom: 1px solid #111;
                }
                .topbar h1 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                .feed {
                    padding-top: 60px;
                }
                .video-card {
                    position: relative;
                    width: 100%;
                    height: 92vh;
                    margin-bottom: 10px;
                    background: #111;
                    border-radius: 6px;
                    overflow: hidden;
                }
                .video-card video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .overlay {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    z-index: 10;
                }
                .overlay h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                }
                .overlay p {
                    margin: 2px 0;
                    font-size: 14px;
                    opacity: 0.8;
                }
                .actions {
                    position: absolute;
                    right: 10px;
                    bottom: 50px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    z-index: 20;
                }
                .actions button {
                    background: #fff;
                    color: #000;
                    padding: 10px;
                    border-radius: 50%;
                    border: none;
                    width: 48px;
                    height: 48px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 700;
                }
                .boost-button {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff0050;
                    color: #fff;
                    border: none;
                    padding: 14px 24px;
                    border-radius: 40px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(255,0,80,0.5);
                    z-index: 999;
                }
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(6px);
                }
                .modal-content {
                    background: #111;
                    margin: 20% auto;
                    padding: 20px;
                    border-radius: 10px;
                    width: 90%;
                    color: #fff;
                    text-align: center;
                }
                .paypal-container {
                    margin-top: 10px;
                }
            `}</style>
            
            <div className="topbar">
                <h1>🔥 Viral Creator Arena</h1>
            </div>

            <div className="feed">
                <div className="video-card">
                    <video src="https://cdn.coverr.co/videos/coverr-young-woman-dancing-3807/1080p.mp4" autoPlay muted loop playsInline></video>
                    <div className="overlay">
                        <h2>@giulia_dance</h2>
                        <p>“Dance Challenge – Week 4 🔥”</p>
                    </div>
                    <div className="actions">
                        <button onClick={(e) => likeVideo(e.currentTarget)}>❤️</button>
                        <button onClick={openBoost}>🚀</button>
                        <button onClick={shareVideo}>🔗</button>
                    </div>
                </div>

                <div className="video-card">
                    <video src="https://cdn.coverr.co/videos/coverr-cook-prepares-a-quick-pasta-2054/1080p.mp4" autoPlay muted loop playsInline></video>
                    <div className="overlay">
                        <h2>@chef_luca</h2>
                        <p>“Ricetta TikTok: Pasta 1 Minuto 🍝”</p>
                    </div>
                    <div className="actions">
                        <button onClick={(e) => likeVideo(e.currentTarget)}>❤️</button>
                        <button onClick={openBoost}>🚀</button>
                        <button onClick={shareVideo}>🔗</button>
                    </div>
                </div>

                <div className="video-card">
                    <video src="https://cdn.coverr.co/videos/coverr-girl-doing-makeup-2106/1080p.mp4" autoPlay muted loop playsInline></video>
                    <div className="overlay">
                        <h2>@beauty_mary</h2>
                        <p>“Makeup Challenge 💄✨”</p>
                    </div>
                    <div className="actions">
                        <button onClick={(e) => likeVideo(e.currentTarget)}>❤️</button>
                        <button onClick={openBoost}>🚀</button>
                        <button onClick={shareVideo}>🔗</button>
                    </div>
                </div>
            </div>

            <button ref={boostButtonRef} className="boost-button" onClick={openBoost}>🚀 BOOST YOUR POST</button>

            <div id="boostModal" ref={boostModalRef} className="modal">
                <div className="modal-content">
                    <h2>Boost your Video 🚀</h2>
                    <p>Get +300% visibility in the Viral Arena</p>
                    <p><strong>Price: €3,49</strong></p>
                    <div className="paypal-container" id="paypal-button-container"></div>
                    <button onClick={closeBoost} style={{ marginTop: '20px', background: '#333', padding: '10px 20px', borderRadius: '6px', color: '#fff' }}>Close</button>
                </div>
            </div>

            <Script
                src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR"
                onLoad={() => {
                    if (window.paypal) {
                        window.paypal.Buttons({
                            createOrder: function(data: any, actions: any) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: { value: "3.49" }
                                    }]
                                });
                            },
                            onApprove: function(data: any, actions: any) {
                                return actions.order.capture().then(function(orderData: any) {
                                    alert("Boost activated! 🚀");
                                });
                            }
                        }).render('#paypal-button-container');
                    }
                }}
            />
        </>
    );
}

    