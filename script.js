// 移動端菜單切換功能
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // 點擊導航鏈接後關閉移動端菜單
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
    
    // 窗口大小改變時重置菜單狀態
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // 滾動時添加header陰影
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 滾動動畫 - 增强版（缩短延迟时间）
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const appearOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 缩短延迟时间，从100ms改为30ms，使元素更快显示
                const delay = Array.from(fadeElements).indexOf(entry.target) * 30;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
    
    // 聯繫我們按鈕
    const contactUsBtn = document.getElementById('contactUsBtn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            contactUsBtn.classList.add('visible');
        } else {
            contactUsBtn.classList.remove('visible');
        }
    });
    
    // 聯繫我們按鈕點擊事件
    contactUsBtn.addEventListener('click', function() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
    
    // 平滑滾動到錨點
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加页面加载时的淡入效果
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

// 电话号码验证功能 - 修改后的版本
const areaCodeSelect = document.getElementById('areaCode');
const phoneInput = document.getElementById('phone');
const phoneHint = document.getElementById('phoneHint');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// 更新电话号码提示
function updatePhoneHint() {
    const areaCode = areaCodeSelect.value;
    if (areaCode === '+852') {
        phoneHint.textContent = '請輸入8位數字';
        phoneInput.placeholder = '請輸入8位數字';
    } else {
        phoneHint.textContent = '請輸入11位數字';
        phoneInput.placeholder = '請輸入11位數字';
    }
}

// 验证电话号码格式
function validatePhoneNumber(phone, areaCode) {
    if (areaCode === '+852') {
        return /^\d{8}$/.test(phone);
    } else {
        return /^\d{11}$/.test(phone);
    }
}

// 区号选择变化事件
areaCodeSelect.addEventListener('change', updatePhoneHint);

// 表单提交事件 - AJAX版本
contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止默认表单提交

    // 设置页面URL到隐藏字段
    document.getElementById('page_url').value = window.location.href;
    
    // 验证必填字段
    const name = document.getElementById('name').value.trim();
    const phone = phoneInput.value.trim();
    const areaCode = areaCodeSelect.value;
    
    if (!name) {
        alert('請填寫您的稱呼');
        return;
    }
    
    if (!phone) {
        alert('請填寫聯絡電話');
        return;
    }
    
    // 验证电话号码格式
    if (!validatePhoneNumber(phone, areaCode)) {
        if (areaCode === '+852') {
            alert('香港電話號碼必須是8位數字');
        } else {
            alert('內地電話號碼必須是11位數字');
        }
        return;
    }
    
    // 显示加载状态
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 使用AJAX提交表单
    const formData = new FormData(contactForm);
    
    // 根据bid字段添加咨询事项字段
    const bid = document.querySelector('input[name="bid"]').value;
    if (bid === '2') {
        // 首页（bid=2）- 添加默认咨询事项
        formData.append('zxsx', '中港綜合法律（內地與香港兩地法律服務，純香港案件不受理）');
    } else if (bid === '3') {
        // 房产页面（bid=3）- 添加默认咨询事项
        formData.append('zxsx1', '綜合法律服務（內地財產分割／合約審查等中港法律事務）');
    }
    
    // 同时提交到两个地方：帝国CMS后台和邮件接口
    Promise.all([
        // 1. 提交到帝国CMS
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        }),
        // 2. 提交到邮件发送接口
        fetch('/send-feedback-email.php', {
            method: 'POST',
            body: formData
        })
    ])
    .then(([cmsResponse, emailResponse]) => {
        if (cmsResponse.ok) {
            // 显示成功弹窗
            successModal.style.display = 'flex';

            // 触发Meta Pixel线索事件
            if (typeof fbq === 'function') {
                fbq('track', 'Lead');
            }

            // 重置表单
            contactForm.reset();
            
            // 触发Google Ads转化事件
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {'send_to': 'AW-17710767718/PU98CKzsxLsbEOa8k_1B'});
            }
            
            // 3秒后自动关闭弹窗
            setTimeout(() => {
                successModal.style.display = 'none';
            }, 3000);
        } else {
            alert('提交失敗，請稍後再試');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('提交過程中發生錯誤，請稍後再試');
    })
    .finally(() => {
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// 关闭弹窗事件
modalCloseBtn.addEventListener('click', function() {
    successModal.style.display = 'none';
});

// 点击弹窗外部关闭
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// 初始化电话号码提示
updatePhoneHint();
});