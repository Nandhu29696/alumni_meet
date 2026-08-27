import { useEffect, useRef, useState } from 'react';

export function ProfileMenu({ user, onProfile, onSignOut }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const initials = (user.name || '').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    useEffect(() => {
        function closeOnOutside(event) { if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false); }
        document.addEventListener('mousedown', closeOnOutside);
        return () => document.removeEventListener('mousedown', closeOnOutside);
    }, []);
    return <div className="profile-menu" ref={menuRef}><button type="button" className="profile-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-label="Open profile menu"><span className="avatar avatar-small">{user.avatar_image ? <img src={user.avatar_image} alt="" /> : initials}</span><span className="profile-identity"><strong>{user.name || 'Member'}</strong><small>{user.role === 'super_admin' || user.role === 'admin' ? 'Administrator' : 'Community member'}</small></span><span className="profile-chevron" aria-hidden="true">⌄</span></button>{open && <div className="profile-dropdown" role="menu"><div className="profile-dropdown-heading"><strong>{user.name}</strong><small>{user.email || (user.role === 'admin' ? 'Administrator' : 'Community member')}</small></div><button type="button" role="menuitem" onClick={() => { setOpen(false); onProfile(); }}>◉ My profile</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onSignOut(); }}>↪ Sign out</button></div>}</div>;
}

export default function Shell({ children, active, setActive, navTabs }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const mobileTabs = navTabs.filter(([item]) => ['Overview', 'Alumni directory', 'Events', 'My events', 'My profile'].includes(item));
    function selectTab(item) { setActive(item); setMenuOpen(false); }
    return <main className="shell">
        <aside className={menuOpen ? 'sidebar menu-open' : 'sidebar'}>
            <div className="mobile-nav-header">
                <div className="brand">
                    <span className="brand-mark">AM</span>
                    <span>Alumni<br /><strong>Meet</strong>
                    </span>
                </div>
                <button type="button" className="menu-button"
                    onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
                    <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                </button>
            </div>
            <div className="desktop-brand brand">
                <span className="brand-mark">AM</span>
                <span>Alumni<br /><strong>Meet</strong>
                </span>
            </div>
            <p className="eyebrow">YOUR COMMUNITY</p>
            <nav aria-label="Main navigation">{navTabs.map(([item, icon]) =>
                <button type="button" key={item}
                    className={active === item ? 'nav-item active' : 'nav-item'}
                    onClick={() => selectTab(item)} aria-current={active === item ? 'page' : undefined}>
                    <span className="nav-icon" aria-hidden="true">{icon}</span>
                    {item}
                </button>)
            }
            </nav>
        </aside>
        {children}
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
            {mobileTabs.map(([item, icon]) =>
                <button
                    type="button"
                    key={item}
                    className={active === item ? 'mobile-bottom-item active' : 'mobile-bottom-item'}
                    onClick={() => selectTab(item)}
                    aria-current={active === item ? 'page' : undefined}
                >
                    <span className="nav-icon" aria-hidden="true">{icon}</span>
                    <span>{item === 'Alumni directory' ? 'Directory' : item === 'My profile' ? 'Profile' : item}</span>
                </button>
            )}
        </nav>
    </main>;
}
