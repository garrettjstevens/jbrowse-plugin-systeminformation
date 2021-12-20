import { isElectron } from '@jbrowse/core/util'
import React, { useEffect, useState } from 'react'
import UAParser from 'ua-parser-js'

import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
  Paper,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  paper: {
    marginBottom: theme.spacing(2),
    margin: theme.spacing(4),
  },
  message: {
    padding: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  },
}))

export default function ReactComponent() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <BasicInfo />
      <ExtendedInfo />
    </div>
  )
}

function BasicInfo() {
  const classes = useStyles()

  const { userAgent } = navigator
  const parser = new UAParser(userAgent)
  const basicInfo = parser.getResult()

  return (
    <Paper elevation={4} className={classes.paper}>
      <Toolbar>
        <Typography className={classes.title} variant="h4" component="div">
          Basic information
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableBody>
            {Object.entries(basicInfo)
              .map(([key, val]) => {
                if (key === 'ua') {
                  return null
                }
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{JSON.stringify(val)}</TableCell>
                  </TableRow>
                )
              })
              .filter(Boolean)}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

function ExtendedInfo() {
  const classes = useStyles()
  const [error, setError] = useState<Error>()
  const [si, setSI] = useState<typeof import('systeminformation')>()
  useEffect(() => {
    async function getSysteminfo() {
      if (!isElectron) {
        return
      }
      try {
        const si = await import('systeminformation')
        setSI(si)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        console.error(error)
        setError(error)
      }
    }

    getSysteminfo()
  }, [])

  if (error) {
    return (
      <Typography color="error" className={classes.message}>
        Error loading system information
        <br />
        {String(error)}
      </Typography>
    )
  }

  return (
    <Paper elevation={4} className={classes.paper}>
      <Toolbar>
        <Typography className={classes.title} variant="h4" component="div">
          Extended information
        </Typography>
      </Toolbar>
      {isElectron ? (
        si ? (
          <>
            <CPUData si={si} setError={setError} />
            <MemData si={si} setError={setError} />
          </>
        ) : (
          <Typography className={classes.message}>loading…</Typography>
        )
      ) : (
        <Typography className={classes.message}>
          This information is only available when using JBrowse Desktop
        </Typography>
      )}
    </Paper>
  )
}

function CPUData({
  si,
  setError,
}: {
  si: typeof import('systeminformation')
  setError(error: Error): void
}) {
  const classes = useStyles()
  const [cpuData, setCPUData] =
    useState<import('systeminformation').Systeminformation.CpuData>()
  useEffect(() => {
    async function getCPUData() {
      try {
        const cpu = await si.cpu()
        setCPUData(cpu)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        console.error(error)
        setError(error)
      }
    }

    getCPUData()
  }, [si, setError])

  if (!cpuData) {
    return <Typography className={classes.message}>loading…</Typography>
  }
  return (
    <>
      <Toolbar>
        <Typography className={classes.title} variant="h6" component="div">
          CPU Information
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableBody>
            {Object.entries(cpuData)
              .map(([key, val]) => {
                if (key === 'ua') {
                  return null
                }
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      {typeof val === 'object'
                        ? JSON.stringify(val)
                        : String(val)}
                    </TableCell>
                  </TableRow>
                )
              })
              .filter(Boolean)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

function MemData({
  si,
  setError,
}: {
  si: typeof import('systeminformation')
  setError(error: Error): void
}) {
  const classes = useStyles()
  const [memData, setMemData] =
    useState<import('systeminformation').Systeminformation.MemData>()
  useEffect(() => {
    async function getMemData() {
      try {
        const mem = await si.mem()
        setMemData(mem)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        console.error(error)
        setError(error)
      }
    }

    getMemData()
  }, [si, setError])

  if (!memData) {
    return <Typography className={classes.message}>loading…</Typography>
  }
  return (
    <>
      <Toolbar>
        <Typography className={classes.title} variant="h6" component="div">
          Memory Information
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableBody>
            {Object.entries(memData)
              .map(([key, val]) => {
                if (key === 'ua') {
                  return null
                }
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      {typeof val === 'object'
                        ? JSON.stringify(val)
                        : String(val)}
                    </TableCell>
                  </TableRow>
                )
              })
              .filter(Boolean)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
