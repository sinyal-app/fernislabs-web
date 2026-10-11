# fernislabs.com DNS (Hostinger)

DNS is managed in Hostinger hPanel → Domains → fernislabs.com → DNS / Nameservers.
Nameservers: Hostinger's (byte/pixel.dns-parking.com). Email (destek@) runs on Hostinger Mail.

## Records before the site went live (2026-10-11)

| Type | Name | Priority | Content | TTL |
|---|---|---|---|---|
| CNAME | hostingermail-a._domainkey | | hostingermail-a.dkim.mail.hostinger.com | 300 |
| CNAME | hostingermail-b._domainkey | | hostingermail-b.dkim.mail.hostinger.com | 300 |
| CNAME | hostingermail-c._domainkey | | hostingermail-c.dkim.mail.hostinger.com | 300 |
| CNAME | reach-a._domainkey | | reach-a.dkim.reach.hostinger.com | 300 |
| CNAME | reach-b._domainkey | | reach-b.dkim.reach.hostinger.com | 300 |
| CNAME | www | | fernislabs.com | 300 |
| CNAME | autodiscover | | autodiscover.mail.hostinger.com | 300 |
| CNAME | autoconfig | | autoconfig.mail.hostinger.com | 300 |
| TXT | _dmarc | | "v=DMARC1; p=none" | 3600 |
| TXT | @ | | "v=spf1 include:_spf.mail.hostinger.com include:_spf.reach.hostinger.com ~all" | 3600 |
| MX | @ | 10 | mx2.hostinger.com | 14400 |
| MX | @ | 5 | mx1.hostinger.com | 14400 |
| A | @ | | 2.57.91.91 (Hostinger parking page) | 50 |

## Changes for GitHub Pages

Only the web records change; every mail record (MX, SPF/DMARC TXT, DKIM CNAMEs,
autodiscover, autoconfig) stays as it is.

- `A @`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (replaces 2.57.91.91)
- `AAAA @`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
- `CNAME www`: sinyal-app.github.io (was fernislabs.com)
