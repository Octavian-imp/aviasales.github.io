import { Col, Flex, Image, Row } from "antd"
import { addMinutes, format, formatDistanceStrict } from "date-fns"
import { ru } from "date-fns/locale/ru"
import React from "react"
import { AviasalesApi } from "../../services/AviasalesApi"
import { Tickets, TicketSegment } from "../../types/Tickets"
import styles from "./index.module.scss"

type TicketCardProps = Tickets

const TicketCard = ({ price, carrier, segments }: TicketCardProps) => {
  
  return (
    <Flex vertical gap={20} className={styles.container}>
      <Flex justify="space-between" align="center">
        <span className={styles.cost}>
          {Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            maximumFractionDigits: 0,
          }).format(price)}
        </span>
        <Image
          className={styles.imgCompany}
          preview={false}
          height={30}
          src={`${AviasalesApi.imgUrl}/${carrier}.png`}
        />
      </Flex>
      {segments.map((segment) => (
        <TicketCard.SegmentTicket
          value={{
            ...segment,
          }}
        />
      ))}
    </Flex>
  )
}

type TicketSegmentProps = {
  value: TicketSegment
}

TicketCard.SegmentTicket = ({
  value: { date, destination, duration, origin, stops },
}: TicketSegmentProps) => {
  const dateStart = Date.parse(date)
  const dateEnd = addMinutes(Date.parse(date), duration)

  return (
    <Row>
      <Col flex={1}>
        <Row className={styles.descriptionTitle}>
          {origin} - {destination}
        </Row>
        <Row className={styles.time}>
          {format(date, "hh:mm")} - {format(dateEnd, "hh:mm")}
        </Row>
      </Col>
      <Col flex={1}>
        <Row className={styles.descriptionTitle}>В пути</Row>
        <Row className={styles.time}>
          ~{formatDistanceStrict(dateStart, dateEnd, {
            locale: ru,
            unit: "hour",
          })}
        </Row>
      </Col>
      <Col flex={1}>
        <Row className={styles.descriptionTitle}>
          {stops.length > 1
            ? `${stops.length} пересадки`
            : stops.length === 1
            ? `${stops.length} пересадка`
            : "Без пересадок"}
        </Row>
        <Row className={styles.time}>
          {stops.map((item, index) =>
            index === stops.length - 1 ? item : item + ", "
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default TicketCard
