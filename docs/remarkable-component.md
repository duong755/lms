- `Grid`

Chia lưới, một dòng có 12 cột

```javascript
<Grid container>
  <Grid item xl={} lg={} md={} sm={} xs={}>
    <Box>this is some text</Box>
  </Grid>
  <Grid item xl={} lg={} md={} sm={} xs={}>
    <Box>this is some text</Box>
  </Grid>
</Grid>
```

- `Box`

Thay thế cho bất cứ thẻ nào trong `html`

```javascript
<Box
  component="element-name"
  display="flex"
  flexDirection="row"
  justifyContent="flex-start"
  alignItems="center"
  alignSelf="stretch"
>
  ...
</Box>
```

- `Typography`

Chỉ dùng để hiển thị text

```javascript
<Typography>...</Typography>
```

- `Paper`

Một element có background và border nổi hơn so với xung quanh

```javascript
<Paper></Paper>
```

- `Button`

```javascript
<Button variant="text|outlined|contained" color="" size="">
  CLICK ME
</Button>
```

- `Link`

Cần phân biệt `Link` của material ui với `Link` của nextjs. Đặt `Link` của nextjs bao ngoài `Link` của material ui.
