module.exports = async(models) => {
    models.user.packs = models.user.hasMany(models.pack);
    models.pack.user = models.pack.belongsTo(models.user);

    models.pack.parcels = models.pack.hasMany(models.parcel);
    models.parcel.pack = models.parcel.belongsTo(models.pack);

    models.lotteryNominal.parcel = models.lotteryNominal.hasMany(models.parcel);
    models.parcel.lotteryNominal = models.parcel.belongsTo(models.lotteryNominal);

    models.lotteryNominal.lotteryNominalStats = models.lotteryNominal.hasMany(models.lotteryNominalStat);
    models.lotteryNominalStat.lotteryNominal = models.lotteryNominalStat.belongsTo(models.lotteryNominal);

    models.nominal.lotteryNominal = models.nominal.hasMany(models.lotteryNominal);
    models.lotteryNominal.nominal = models.lotteryNominal.belongsTo(models.nominal);

    models.lottery.lotteryNominal = models.lottery.hasMany(models.lotteryNominal);
    models.lotteryNominal.lottery = models.lotteryNominal.belongsTo(models.lottery);
    models.lottery.packs = models.lottery.hasMany(models.pack);
    models.pack.lottery = models.pack.belongsTo(models.lottery);

    models.partner.lotteries = models.partner.belongsToMany(models.lottery, {through: 'partner_lottery'});
    models.lottery.partners = models.lottery.belongsToMany(models.partner, {through: 'partner_lottery'});

    models.partner.days = models.partner.belongsToMany(models.day, {through: 'partner_day'});
    models.day.partners = models.day.belongsToMany(models.partner, {through: 'partner_day'});
    models.partner.statByDays = models.partner.hasMany(models.statByDay);
    models.statByDay.partners = models.statByDay.belongsTo(models.partner);

    models.lotteryNominal.statsByDay = models.lotteryNominal.hasMany(models.statByDay);
    models.statByDay.partner = models.statByDay.belongsTo(models.lotteryNominal);

    models.day.statByDay = models.day.hasOne(models.statByDay);
    models.statByDay.day = models.statByDay.belongsTo(models.day);
}