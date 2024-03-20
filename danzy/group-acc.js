var danz = async (m, {
    conn,
    args
}) => {
    var [command, options] = args;
    var joinRequestList = await conn.groupRequestParticipantsList(m.chat);

    var formatDate = (timestamp) => new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(timestamp * 1000));

    switch (command) {
        case "list":
            var formattedList = joinRequestList.length > 0 ?
                joinRequestList.map((request, i) => `*${i + 1}.*\n• Nomor: ${request.jid.split('@')[0]}\n• Metode Permintaan: ${request.request_method}\n• Waktu Permintaan: ${formatDate(request.request_time)}\n\n`).join('') :
                "Tidak ada permintaan bergabung yang tertunda.";
            return m.reply(`*Daftar Permintaan Bergabung:*\n\n${formattedList}`);
            break;

        case "reject":
        case "approve":
            if (options === "all") {
                for (var request of joinRequestList) {
                    await conn.groupRequestParticipantsUpdate(m.chat, [request.jid], command);
                    console.log(`Meng-${command} participant dengan JID: ${request.jid}`);
                }
                return m.reply(`*${command === 'approve' ? 'Menyetujui' : 'Menolak'} semua permintaan bergabung.*`);
            } else {
                var actions = options.split('|').map(action => action.trim());
                var participants = actions.map(action => joinRequestList[parseInt(action) - 1]).filter(request => request);
                if (participants.length > 0) {
                    var formattedResponse = '';
                    for (var request of participants) {
                        var response = await conn.groupRequestParticipantsUpdate(m.chat, [request.jid], command);
                        var status = response[0].status === 'success' ? 'Gagal' : 'Berhasil';
                        formattedResponse += `*${participants.indexOf(request) + 1}.*\n• Status: ${status}\n• Nomor: ${request.jid.split('@')[0]}\n\n`;
                        console.log(`Meng-${command} participant dengan JID: ${request.jid}`);
                    }
                   return m.reply(`*${command === 'approve' ? 'Menyetujui' : 'Menolak'} Permintaan Bergabung:*\n\n${formattedResponse}`);
                } else {
                   return m.reply("Tidak ada anggota yang cocok untuk reject/approve.");
                }
            }
            break;

        default:
            return m.reply("*Perintah tidak valid.*\nGunakan:\n- *acc list*\n- *acc approve [number]*\n- *acc reject [number]*\n- *acc reject [JID]*\n- *acc reject/approve all* untuk menolak/menyetujui semua permintaan bergabung.");
    }
}

danz.command = danz.help = ["acc"]
danz.tags = ["group"]
danz.group = true
danz.admin = true
danz.botAdmin = true

module.exports = danz