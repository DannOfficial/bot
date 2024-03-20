module.exports = {
    async before(m, { match }) {
        // Jika pesan bukan dari pengguna
        if (!m.chat.endsWith('@s.whatsapp.net')) return true;

        // Inisialisasi jika objek anonymous belum ada
        this.anonymous = this.anonymous ? this.anonymous : {};

        // Cari room anonymous yang sedang berlangsung dengan pengguna saat ini
        let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING');

        // Jika ditemukan room
        if (room) {
            // Jika pesan mengandung kata kunci 'next', 'leave', atau 'start', abaikan
            if (/^.*(next|leave|start)/.test(m.text)) return;

            // Temukan pengguna lain dalam room
            let other = [room.a, room.b].find(user => user !== m.sender);

            // Tunda sejenak sebelum meneruskan pesan
            await this.delay(1000);

            // Meneruskan pesan ke pengguna lain
            m.copyNForward(other, true, m.quoted && m.quoted.fromMe ? {
                contextInfo: {
                    ...m.msg.contextInfo,
                    forwardingScore: 1,
                    isForwarded: true,
                    participant: other
                }
            } : {});
        }

        // Lanjutkan proses pesan
        return true;
    }
}