module.exports = async(models) => {
    models.user.releasedPacks = models.user.hasMany(models.pack);
    models.pack.user = models.pack.belongsTo(models.user);

    models.pack.parts = models.pack.hasMany(models.parcel);
    models.parcel.pack = models.parcel.belongsTo(models.pack);

    models.lotteryNominal.parcel = models.lotteryNominal.hasMany(models.parcel);
    models.parcel.lotteryNominal = models.parcel.belongsTo(models.lotteryNominal);

    models.nominal.lotteryNominal = models.nominal.hasMany(models.lotteryNominal);
    models.lotteryNominal.nominal = models.lotteryNominal.belongsTo(models.nominal);

    models.partner.lotteries = models.partner.belongsToMany(models.lottery, {through: 'PartnerLottery'});
    models.lottery.partners = models.lottery.belongsToMany(models.partner, {through: 'PartnerLottery'});

    models.partner.statsByDay = models.partner.hasMany(models.statByDay);
    models.statByDay.partner = models.statByDay.belongsTo(models.partner);

    models.lotteryNominal.statsByDay = models.lotteryNominal.hasMany(models.statByDay);
    models.statByDay.partner = models.statByDay.belongsTo(models.lotteryNominal);

    models.hardDay.statByDay = models.hardDay.hasOne(models.statByDay);
    models.statByDay.hardDay = models.statByDay.belongsTo(models.hardDay);
}